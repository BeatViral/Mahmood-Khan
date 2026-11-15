/**
 * WORLD POP — free Google Drive episode intake queue.
 *
 * This Google Apps Script is OPTIONAL and NOT active until installed and
 * authorised by the Google account that owns the WORLD POP folder.
 * No GitHub token or external AI/transcription service is required.
 *
 * Workflow: new audio or transcript file in the EXISTING Drive folder
 * -> once an hour this script adds/updates a row in a PRIVATE Google Sheet
 * -> audio waits for transcription and editorial verification.
 * Nothing from private Drive is automatically put on a public website.
 */
const WORLD_POP_FOLDER_ID = '1Ars8NSU0GfKBDWjTcFgvd1I-gH97IkUx';
const QUEUE_NAME = 'WORLD POP — Episode Intake Queue';
const QUEUE_COLUMNS = [
  'First seen (Sydney time)', 'Episode', 'Media type', 'Filename', 'File size (MB)',
  'Drive file URL', 'Drive file ID', 'Last modified (Sydney time)',
  'Transcript available?', 'Publication status'
];

function setupWorldPopIntake() {
  // Creates the private queue if necessary and avoids duplicate time triggers.
  getOrCreateQueue_();
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'scanWorldPopEpisodes')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('scanWorldPopEpisodes').timeBased().everyHours(1).create();
  scanWorldPopEpisodes();
}

function scanWorldPopEpisodes() {
  const sheet = getOrCreateQueue_().getSheets()[0];
  const folder = DriveApp.getFolderById(WORLD_POP_FOLDER_ID);
  const known = new Map();
  const last = sheet.getLastRow();
  if (last >= 2) {
    const rows = sheet.getRange(2, 1, last - 1, QUEUE_COLUMNS.length).getValues();
    rows.forEach((r, i) => { if (r[6]) known.set(String(r[6]), i + 2); });
  }

  const all = [];
  const it = folder.getFiles();
  while (it.hasNext()) {
    const file = it.next();
    const name = file.getName();
    const type = file.getMimeType();
    const episode = episodeNumber_(name);
    if (!episode) continue;
    const isAudio = /^audio\//i.test(type) || /\.(mp3|m4a|wav|flac)$/i.test(name);
    const isText = type === MimeType.GOOGLE_DOCS ||
      /\.(txt|md|vtt|srt|docx|pdf)$/i.test(name);
    if (!isAudio && !isText) continue;
    all.push({file, name, episode, mediaType: isAudio ? 'Audio upload' : 'Transcript / notes'});
  }

  const transcriptEpisodes = new Set(all.filter(x => x.mediaType === 'Transcript / notes')
    .map(x => x.episode));
  let appended = 0, updated = 0;
  for (const x of all) {
    const file = x.file, id = file.getId();
    const modified = Utilities.formatDate(file.getLastUpdated(), 'Australia/Sydney', 'yyyy-MM-dd HH:mm');
    const available = transcriptEpisodes.has(x.episode) ? 'YES — verify transcript' : 'NO';
    const status = x.mediaType === 'Audio upload'
      ? 'NOT PUBLISHED — transcript and editorial review required'
      : 'SOURCE RECEIVED — content not yet reviewed';
    const row = [
      known.has(id) ? sheet.getRange(known.get(id), 1).getValue()
        : Utilities.formatDate(new Date(), 'Australia/Sydney', 'yyyy-MM-dd HH:mm'),
      x.episode, x.mediaType, x.name,
      Math.round((file.getSize() / 1048576) * 100) / 100,
      file.getUrl(), id, modified, available,
      known.has(id) ? sheet.getRange(known.get(id), 10).getValue() || status : status
    ];
    if (known.has(id)) {
      sheet.getRange(known.get(id), 1, 1, row.length).setValues([row]);
      updated++;
    } else {
      sheet.appendRow(row);
      known.set(id, sheet.getLastRow());
      appended++;
    }
  }
  return {scanned: all.length, appended, updated};
}

function episodeNumber_(name) {
  // Accept EP02, EP 02, episode_02, World pop Show 2; ignore unrelated files.
  const m = String(name).match(/(?:^|[^a-z0-9])(?:EP(?:ISODE)?[\s_-]*0*|SHOW[\s_-]*0*)(\d{1,3})(?!\d)/i);
  return m ? 'EP' + String(Number(m[1])).padStart(2, '0') : '';
}

function getOrCreateQueue_() {
  const props = PropertiesService.getScriptProperties();
  const savedId = props.getProperty('WORLD_POP_QUEUE_SHEET_ID');
  if (savedId) {
    try { return SpreadsheetApp.openById(savedId); } catch (e) {
      // Recreate only if the old sheet was deleted or access was lost.
      props.deleteProperty('WORLD_POP_QUEUE_SHEET_ID');
    }
  }
  const sheetFile = SpreadsheetApp.create(QUEUE_NAME);
  const sheet = sheetFile.getSheets()[0];
  sheet.setName('Episode intake');
  sheet.getRange(1, 1, 1, QUEUE_COLUMNS.length).setValues([QUEUE_COLUMNS]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, QUEUE_COLUMNS.length)
    .setBackground('#15252f').setFontColor('#f4e6ca').setFontWeight('bold');
  sheet.autoResizeColumns(1, QUEUE_COLUMNS.length);
  DriveApp.getFileById(sheetFile.getId()).moveTo(DriveApp.getFolderById(WORLD_POP_FOLDER_ID));
  props.setProperty('WORLD_POP_QUEUE_SHEET_ID', sheetFile.getId());
  return sheetFile;
}

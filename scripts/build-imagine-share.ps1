# Render the campaign's typography as a 1200 x 630 social share PNG.
Add-Type -AssemblyName System.Drawing
$outputPath = Join-Path $PSScriptRoot '../assets/images/imagine-share.png'
$canvas = [Drawing.Bitmap]::new(2400,1260)
$graphics = [Drawing.Graphics]::FromImage($canvas)
$graphics.Clear([Drawing.Color]::FromArgb(8,8,8))
$graphics.ScaleTransform(2,2)
$graphics.TextRenderingHint = [Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$gold = [Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(244,202,89))
$white = [Drawing.SolidBrush]::new([Drawing.Color]::FromArgb(246,245,240))
$format = [Drawing.StringFormat]::GenericTypographic.Clone()
$format.FormatFlags = $format.FormatFlags -bor [Drawing.StringFormatFlags]::NoWrap
function Draw-CampaignLine([string]$text,[single]$size,[single]$x,[single]$y,$brush) {
    $font = [Drawing.Font]::new('Arial',$size,[Drawing.FontStyle]::Bold,[Drawing.GraphicsUnit]::Pixel)
    $width = $graphics.MeasureString($text,$font,1200,$format).Width
    if ($width -gt (1200 - $x - 60)) { throw "Text exceeds safe area: $text" }
    $graphics.DrawString($text,$font,$brush,[Drawing.PointF]::new($x,$y),$format)
    $font.Dispose()
}
Draw-CampaignLine 'IMAGINE.' 180 60 68 $gold
Draw-CampaignLine 'BEFORE THE ALGORITHMS.' 63 65 280 $white
Draw-CampaignLine 'BACK TO THE MUSIC.' 63 65 360 $white
Draw-CampaignLine 'MAHMOOD KHAN' 25 68 515 $gold
Draw-CampaignLine 'WITH ORCHESTRAS OF THE WORLD' 17 68 553 $white
$final = [Drawing.Bitmap]::new(1200,630)
$finalGraphics = [Drawing.Graphics]::FromImage($final)
$finalGraphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$finalGraphics.DrawImage($canvas,0,0,1200,630)
$final.Save($outputPath,[Drawing.Imaging.ImageFormat]::Png)
$finalGraphics.Dispose()
$final.Dispose()
$format.Dispose()
$gold.Dispose()
$white.Dispose()
$graphics.Dispose()
$canvas.Dispose()
Write-Output "Created $outputPath (1200 x 630)"

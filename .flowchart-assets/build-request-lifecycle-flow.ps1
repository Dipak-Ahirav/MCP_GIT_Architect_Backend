Add-Type -AssemblyName System.Drawing

$output = "D:\Projects\AI AGENT\GIT_MCP_AGENT\gitarchitect\backend\GitArchitect_Request_Lifecycle_Flow.png"
$width = 2200
$height = 1080
$bitmap = New-Object System.Drawing.Bitmap $width, $height
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

function Brush($hex) {
  return New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($hex))
}

function Pen($hex, $size) {
  $p = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml($hex), $size)
  $p.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $p.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  return $p
}

function Draw-RoundedRect($g, $x, $y, $w, $h, $r, $fill, $stroke) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  $g.FillPath($fill, $path)
  $g.DrawPath($stroke, $path)
  $path.Dispose()
}

function Draw-CenteredText($g, $text, $font, $brush, $rect, $format) {
  $g.DrawString($text, $font, $brush, $rect, $format)
}

function Draw-Arrow($g, $x1, $y1, $x2, $y2, $pen) {
  $cap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap 8, 10
  $arrowPen = $pen.Clone()
  $arrowPen.CustomEndCap = $cap
  $g.DrawLine($arrowPen, $x1, $y1, $x2, $y2)
  $arrowPen.Dispose()
  $cap.Dispose()
}

$bg = Brush "#F6F8FC"
$graphics.FillRectangle($bg, 0, 0, $width, $height)

$ink = Brush "#07142B"
$muted = Brush "#52627A"
$white = Brush "#FFFFFF"
$blueFill = Brush "#EEF5FF"
$blueStroke = Pen "#73A7F7" 3
$purpleFill = Brush "#F2EDFF"
$purpleStroke = Pen "#8974ED" 3
$redFill = Brush "#FFF0F0"
$redStroke = Pen "#EC8686" 3
$greenFill = Brush "#ECFBF3"
$greenStroke = Pen "#58C985" 3
$grayFill = Brush "#EEF2F7"
$grayStroke = Pen "#95A3B8" 3
$yellowFill = Brush "#FFF8DF"
$yellowStroke = Pen "#E1B744" 3
$linePen = Pen "#5C6B80" 5
$softPen = Pen "#8A97AA" 4
$softPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash

$titleFont = New-Object System.Drawing.Font "Segoe UI", 34, ([System.Drawing.FontStyle]::Bold)
$subtitleFont = New-Object System.Drawing.Font "Segoe UI", 18, ([System.Drawing.FontStyle]::Regular)
$stepFont = New-Object System.Drawing.Font "Segoe UI", 13, ([System.Drawing.FontStyle]::Bold)
$boxTitleFont = New-Object System.Drawing.Font "Segoe UI", 21, ([System.Drawing.FontStyle]::Bold)
$bodyFont = New-Object System.Drawing.Font "Segoe UI", 15, ([System.Drawing.FontStyle]::Regular)
$smallFont = New-Object System.Drawing.Font "Segoe UI", 13, ([System.Drawing.FontStyle]::Regular)

$formatCenter = New-Object System.Drawing.StringFormat
$formatCenter.Alignment = [System.Drawing.StringAlignment]::Center
$formatCenter.LineAlignment = [System.Drawing.StringAlignment]::Center
$formatNear = New-Object System.Drawing.StringFormat
$formatNear.Alignment = [System.Drawing.StringAlignment]::Near
$formatNear.LineAlignment = [System.Drawing.StringAlignment]::Near

$graphics.DrawString("GitArchitect Request Lifecycle Flow", $titleFont, $ink, 70, 48)
$graphics.DrawString("How every repository-aware screen sends input, resolves context, runs agents, reads GitHub evidence, and renders cards.", $subtitleFont, $muted, 72, 98)

$steps = @(
  @{x=80;y=210;w=270;h=190;fill=$blueFill;stroke=$blueStroke;num="1";title="Angular UI";body="Sends sessionId`nand user input";hint="PR #, issue #, run ID,`nor chat question"},
  @{x=410;y=210;w=270;h=190;fill=$purpleFill;stroke=$purpleStroke;num="2";title="Express API";body="Receives request`nand validates route";hint="/api/v1/agent/..."},
  @{x=740;y=210;w=300;h=190;fill=$redFill;stroke=$redStroke;num="3";title="MongoDB";body="Loads selected`nrepository by sessionId";hint="owner, repo, branch, URL"},
  @{x=1100;y=210;w=300;h=190;fill=$yellowFill;stroke=$yellowStroke;num="4";title="Service Layer";body="Chooses workflow and`nstarts correct agent";hint="PR, issue, CI, chat, repo"},
  @{x=1460;y=210;w=300;h=190;fill=$greenFill;stroke=$greenStroke;num="5";title="AI Agent";body="Builds analysis using`nrepository context";hint="Structured output schema"},
  @{x=1460;y=525;w=300;h=190;fill=$grayFill;stroke=$grayStroke;num="6";title="GitHub Data";body="REST API / MCP tools";hint="Files, PRs, issues,`nchecks, logs"},
  @{x=1100;y=790;w=300;h=190;fill=$purpleFill;stroke=$purpleStroke;num="7";title="JSON Response";body="Backend returns`nstructured data";hint="data.review or`ndata.analysis"},
  @{x=740;y=790;w=300;h=190;fill=$blueFill;stroke=$blueStroke;num="8";title="UI Cards";body="Frontend renders`nsummary and details";hint="scores, risks, files,`nplans, findings"}
)

foreach ($s in $steps) {
  Draw-RoundedRect $graphics $s.x $s.y $s.w $s.h 24 $s.fill $s.stroke
  $badgeBrush = Brush "#07142B"
  $badgeText = Brush "#FFFFFF"
  $badgeRect = New-Object System.Drawing.RectangleF ($s.x + 22), ($s.y + 20), 42, 42
  $graphics.FillEllipse($badgeBrush, $badgeRect)
  Draw-CenteredText $graphics $s.num $stepFont $badgeText $badgeRect $formatCenter
  $titleRect = New-Object System.Drawing.RectangleF ($s.x + 78), ($s.y + 18), ($s.w - 98), 48
  Draw-CenteredText $graphics $s.title $boxTitleFont $ink $titleRect $formatNear
  $bodyRect = New-Object System.Drawing.RectangleF ($s.x + 24), ($s.y + 78), ($s.w - 48), 66
  Draw-CenteredText $graphics $s.body $bodyFont $ink $bodyRect $formatCenter
  $hintRect = New-Object System.Drawing.RectangleF ($s.x + 24), ($s.y + $s.h - 48), ($s.w - 48), 38
  Draw-CenteredText $graphics $s.hint $smallFont $muted $hintRect $formatCenter
}

Draw-Arrow $graphics 350 305 410 305 $linePen
Draw-Arrow $graphics 680 305 740 305 $linePen
Draw-Arrow $graphics 1040 305 1100 305 $linePen
Draw-Arrow $graphics 1400 305 1460 305 $linePen
Draw-Arrow $graphics 1610 400 1610 525 $softPen
Draw-Arrow $graphics 1460 620 1320 620 $softPen
$graphics.DrawLine($softPen, 1320, 620, 1250, 790)
Draw-Arrow $graphics 1100 885 1040 885 $linePen

$calloutFill = Brush "#DCFCE7"
$calloutStroke = Pen "#79D99B" 3
Draw-RoundedRect $graphics 80 800 570 160 22 $calloutFill $calloutStroke
$graphics.DrawString("Demo line to speak:", (New-Object System.Drawing.Font "Segoe UI", 18, ([System.Drawing.FontStyle]::Bold)), $ink, 112, 825)
$graphics.DrawString("Angular sends sessionId + input. Backend resolves the selected repo, agents inspect GitHub evidence, and the UI renders structured cards.", $bodyFont, $ink, (New-Object System.Drawing.RectangleF 112, 865, 505, 74), $formatNear)

$graphics.DrawString("Request path", $smallFont, $muted, 82, 176)
$graphics.DrawString("Evidence lookup", $smallFont, $muted, 1480, 482)
$graphics.DrawString("Response path", $smallFont, $muted, 742, 754)

$bitmap.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$bitmap.Dispose()

Write-Output $output

from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from wand.image import Image

import os
import errno

DEFAULT_FONT = 'Helvetica'
DEFAULT_FONT_SIZE = 12

# Converts pixels to points
def pxToPt(px):
  return px * 72 / 100

# Converts points to pixels
def ptToPx(pt):
  return pt * 100 / 72

# Converts inches to points
def inchesToPt(inches):
  return 72 * inches

# 
def pdfToPng(pdfPath, pngPath):
  with Image(filename=pdfPath, resolution=100) as img:
    with img.convert('png') as converted:
      converted.save(filename=pngPath)

# Converts a pdf to multiple png files and saves them in a given directory with a given file name
# prefix (optional)
def pdfToPngs(pdfPath, pngFolderPath, pngName=None):
  if pngName is None:
    pngName = os.path.basename(pdfPath)
    pngName = pngName[0:pngName.rfind('.')]
  if os.path.isdir(pngFolderPath):
    with Image(filename=pdfPath, resolution=100) as source:
      imgs = source.sequence
      pageCt = len(imgs)
      for p in range(pageCt):
        with Image(imgs[p]).convert('png') as pngPage:
          pngPath = pngFolderPath + os.sep + pngName
          pngPath += '-' + str(p + 1) + '.png' if pageCt > 0 else '.png'
          pngPage.save(filename=pngPath)
  else:
    raise(FileNotFoundError(errno.ENOENT, os.strerror(errno.ENOENT), pngFolderPath))

# 
def pngToPdf(pngPaths, pdfPath):
  canv = canvas.Canvas(pdfPath, pagesize=letter)
  if type(pngPaths) is str:
    pngPaths = [pngPaths]
  for pngPath in pngPaths:
    bg = ImageReader(pngPath)
    canv.drawImage(bg, 0, 0, width=inchesToPt(8.5), height=inchesToPt(11), mask='auto')
    canv.showPage()
  canv.save()

# Fills in a pdf canvas with the doc input content
def fillInput(canvas, text, leftPx, topPx, fontSizePt):
  pad = 2
  x = pxToPt(leftPx) + pad
  y = inchesToPt(11) - pxToPt(topPx) - fontSizePt - pad
  canvas.drawString(x, y, text)

# Represents the location and data for a document input on a pdf page
class DocInput:
  # Constructor
  def __init__(self, leftPx, topPx, text='', font=DEFAULT_FONT, fontSizePt=DEFAULT_FONT_SIZE):
    self.leftPx = leftPx
    self.topPx = topPx
    self.text = text
    self.font = font
    self.fontSizePt = fontSizePt

  # Fills in a pdf canvas with the doc input content
  def fill(self, canvas):
    pad = 2
    x = pxToPt(self.leftPx) + pad
    y = inchesToPt(11) - pxToPt(self.topPx) - self.fontSizePt - pad
    canvas.setLineWidth(1)
    canvas.setFont(self.font, self.fontSizePt)
    canvas.drawString(x, y, self.text)

# bg = ImageReader('MHC Contract (converted).png')
# canvas = canvas.Canvas('form.pdf', pagesize=letter)
# canvas.drawImage(bg, 0, 0, width=inchesToPt(8.5), height=inchesToPt(11), mask='auto')

# inputs = [
#   DocInput(60, 178, 'John Doe'),
#   DocInput(60, 214, '123 Cool Street'),
#   DocInput(60, 250, 'Atlanta, GA 30505'),
#   DocInput(60, 286, 'Jane Doe'),
#   DocInput(300, 762, '1234.56'),
#   DocInput(300, 788, '2345.67'),
#   DocInput(300, 814, '3456.78'),
#   DocInput(460, 250, 'john.doe@gmail.com'),
#   DocInput(460, 286, '555-555-1234')
# ]

# for input in inputs:
#   input.fill(canvas)
# canvas.save()

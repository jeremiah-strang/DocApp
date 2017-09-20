from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from wand.image import Image

DEFAULT_FONT = 'Helvetica'
DEFAULT_FONT_SIZE = 12

def pxToPt(px):
  return px * 72 / 100

def ptToPx(pt):
  return pt * 100 / 72

def inchesToPt(inches):
  return 72 * inches

def pdfToPnG(pdfPath, pngPath):
  with Image(filename=pdfPath, resolution=100) as img:
    with img.convert('png') as converted:
      converted.save(filename=pngPath)

def fillInput(canvas, text, leftPx, topPx, fontSizePt):
  pad = 2
  x = pxToPt(leftPx) + pad
  y = inchesToPt(11) - pxToPt(topPx) - fontSizePt - pad
  canvas.drawString(x, y, text)

class DocInput:
  def __init__(self, leftPx, topPx, text='', font=DEFAULT_FONT, fontSizePt=DEFAULT_FONT_SIZE):
    self.leftPx = leftPx
    self.topPx = topPx
    self.text = text
    self.font = font
    self.fontSizePt = fontSizePt

  def fill(self, canvas):
    pad = 2
    x = pxToPt(self.leftPx) + pad
    y = inchesToPt(11) - pxToPt(self.topPx) - self.fontSizePt - pad
    canvas.setLineWidth(1)
    canvas.setFont(self.font, self.fontSizePt)
    canvas.drawString(x, y, self.text)

bg = ImageReader('MHC Contract (converted).png')
canvas = canvas.Canvas('form.pdf', pagesize=letter)
canvas.drawImage(bg, 0, 0, width=inchesToPt(8.5), height=inchesToPt(11), mask='auto')

inputs = [
  DocInput(60, 178, 'John Doe'),
  DocInput(60, 214, '123 Cool Street'),
  DocInput(60, 250, 'Atlanta, GA 30505'),
  DocInput(60, 286, 'Jane Doe'),
  DocInput(300, 762, '1234.56'),
  DocInput(300, 788, '2345.67'),
  DocInput(300, 814, '3456.78'),
  DocInput(460, 250, 'john.doe@gmail.com'),
  DocInput(460, 286, '555-555-1234')
]

for input in inputs:
  input.fill(canvas)
canvas.save()

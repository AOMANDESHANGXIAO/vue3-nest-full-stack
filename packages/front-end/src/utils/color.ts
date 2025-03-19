export const rgbToHex = (rgb: string) => {
  const rgbValues = rgb.split(',').map(value => parseInt(value.trim(), 10))
  const [r, g, b] = rgbValues

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
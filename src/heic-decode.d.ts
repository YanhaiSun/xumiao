declare module 'heic-decode' {
  interface DecodedImage {
    width: number
    height: number
    data: Uint8ClampedArray
  }

  interface DecodedImageWithDispose extends DecodedImage {
    dispose: () => void
  }

  export function decode(options: { buffer: ArrayBuffer }): Promise<DecodedImage>
  export function all(options: { buffer: ArrayBuffer }): Promise<DecodedImageWithDispose[]>
}

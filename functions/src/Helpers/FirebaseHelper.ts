const mime = require("mime-types");

export default class FirebaseHelper {
  /**
   * @param array the array to iterate
   * @param callback the callback function call on every iteration
   * Run async for each
   *
   */
  static async asyncForEach(array: any[], callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  /**
   * @param base64 the base64 string
   * Get buffer object from base64
   * @returns Buffer
   *
   */
  static getBufferFromBase64(base64: string): Buffer {
    const base64EncodedImageString = base64.replace(
      /^data:image\/\w+;base64,/,
      ""
    );
    return Buffer.from(base64EncodedImageString, "base64");
  }

  /**
   * @param base64 the base64 string
   * Get MimeType from base64
   * @returns MimeType
   *
   */
  static getMimeTypeFromBase64(base64: string): string {
    const mimeType = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    return mimeType && mimeType[1] ? mime.contentType(mimeType[1]) : "";
  }
  /**
   * @param mimeType the mimeType string
   * Get Extension from mimeType
   * @returns Extension string
   *
   */
  static getExtensionFromMimeType(mimeType: string): string {
    return mime.extension(mimeType);
  }
}

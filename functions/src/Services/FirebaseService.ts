import FirebaseHelper from "../Helpers/FirebaseHelper";
import { Request } from "express";
import * as admin from "firebase-admin";
import { db } from "../db";
import { ResponseStatus } from "../Models/ResponseStatus/ResponseStatus";

class FirebaseService {
  static readonly STORAGE_PUBLIC_URL =
    "https://storage.googleapis.com/coud-food.appspot.com/";

  /**
   * @param req the request object
   * Get Uid from request and with verify token
   * @returns Promise<string>
   */
  async getUserIdFromRequest(req: Request): Promise<string> {
    let idToken = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      idToken = req.headers.authorization.split("Bearer ")[1];
    }
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.uid;
  }

  /**
   * Add a basket
   * post on /{collection}/
   * @param base64files
   * @param ref
   * Return status and message
   *
   */
  async addObject(req: Request, collection: string): Promise<ResponseStatus> {
    const uid = await this.getUserIdFromRequest(req);

    if (!uid) {
      return Promise.reject({
        status: 401,
        message: "Unauthorized user"
      });
    }

    if (!req.body) {
      return Promise.reject({
        status: 400,
        message: "Object not found in body"
      });
    }

    let object: Object;
    try {
        object = req.body;    // TODO: Remove line break for Parsing Json, to delete when unmock
    } catch (error) {
        console.log(`Unexpected error while adding object to collection ${collection} : `, error);
        return Promise.reject({
            status: 500,
            message: error
        });
    }
    
    const ref = db.collection(collection).add(object);

    ref
      .catch(error => {
        console.log('Unable to save objet ', error);
        return Promise.reject({
          status: 500,
          message: error
        });
      });

    return Promise.resolve({
      status: 200,
      message: "success"
    });
  }


  /**
   * Get from collection
   * get on /{collection}/
   * @param base64files
   * @param ref
   * Return status and message
   *
   */
  async getAllObjects(req: Request, collection: string): Promise<ResponseStatus> {
    const uid = await this.getUserIdFromRequest(req);

    if (!uid) {
      return Promise.reject({
        status: 401,
        message: "Unauthorized user"
      });
    }
   
    const objectsToReturn: object[] = [];
    await db.collection(collection).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            objectsToReturn.push(doc.data())
        });
        return objectsToReturn;
        }, error => {
            return Promise.reject({
                status: 500,
                message: error
            });
        });

    return Promise.resolve({
      status: 200,
      message: JSON.stringify(objectsToReturn)
    });
  }


  /**
   * Upload base64 files to ref in bucket
   * Return Promise<string[]> who contains public url
   * @param images
   * @param ref
   */
  async uploadImages(
    base64files: string[],
    ref: string | null
  ): Promise<string[]> {
    if (!ref) {
      throw { status: 500, message: `Error ref database is null` };
    }
    const urls: string[] = [];
    const start = async () => {
      await FirebaseHelper.asyncForEach(
        base64files,
        async (image: string, index: number) => {
          const mimeType = FirebaseHelper.getMimeTypeFromBase64(image);
          const imageBuffer = FirebaseHelper.getBufferFromBase64(image);
          const filePath = `images/baskets/${ref}/photo${index}.${FirebaseHelper.getExtensionFromMimeType(
            mimeType
          )}`;

          const file = admin
            .storage()
            .bucket()
            .file(filePath);

          await file.save(imageBuffer, {
            metadata: { contentType: mimeType },
            validation: "md5"
          });

          urls.push(FirebaseService.STORAGE_PUBLIC_URL + filePath);
        }
      );

      return Promise.resolve(urls);
    };
    return start();
  }
}

export default new FirebaseService();

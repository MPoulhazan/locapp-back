import { db } from "../db";
import * as functions from "firebase-functions";
import FirebaseService from "../Services/FirebaseService";
import { Request, Response } from "express";

const database = db.collection("users");

/**
 * function -> create a new appUser when a firebase user is created
 *
 */

export const createUser = functions.auth.user().onCreate(firebaseUser => {
  return database.doc(firebaseUser.uid).set({
    name: firebaseUser.displayName,
    profilePicture: firebaseUser.photoURL,
    id: firebaseUser.uid
  });
});

/**
 * function -> delete appUser when his account his deleted
 *
 */
export const deleteUser = functions.auth.user().onDelete(user => {
  database
    .doc(user.uid)
    .delete()
    .catch();
});

/**
 * Return the authentified profile
 * @param req
 * @param res
 */
export const getAuthentifiedUser = async (req: Request, res: Response) => {
  const userId = await FirebaseService.getUserIdFromRequest(req);
  if (!userId) {
    return Promise.reject(null);
  }

  return await db
    .collection("users")
    .doc(userId)
    .get()
    .then(async data => {
      return await res.status(200).json(data.data());
    })
    .catch(error => {
      return res.status(error.code).json({
        message: `Something went wrong. ${error.message}`
      });
    });
};

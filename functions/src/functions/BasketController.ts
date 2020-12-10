import { Basket } from './../Models/Basket/Basket';
import { Request, Response } from "express";
import FirebaseService from "../Services/FirebaseService";
import { db } from "../db";

import { ResponseStatus } from "../Models/ResponseStatus/ResponseStatus";


export const BASKET_INDEX_NAME = "baskets";
/**
 * function -> Add a basket
 * get /baskets
 */

export const post = async (req: Request, res: Response) => {
    console.log('Add new basket');
    try {
        const responseSatus: ResponseStatus = await FirebaseService.addObject(
            req,
            BASKET_INDEX_NAME
        );
        res.status(responseSatus.status).json({
            message: responseSatus.message
        });
    } catch (error) {
        console.log('Unable to add new Basket : ', error);
        res.status(error.status).json({
            message: error.message
        });
    }

    return;
};

/**
 * function -> get all baskets
 * get /baskets
 */

export const getAllBaskets = async (req: Request, res: Response) => {
    try {
        const data = await db.collection('baskets').get().then(bkts => {
            return bkts.docs.map(doc => doc.data() as Basket);
        });

        return res.status(200).json({
            data
        });
    } catch (error) {
        return res.status(error.status).json({
            message: error.message
        });
    }
};


/**
 * function -> get all baskets
 * get /baskets/:id
 */

export const getBasketById = async (req: Request, res: Response) => {
    const id: number = +req.params.id;

    console.log(`Get a basket with id ${id}`);

    try {
        const basketCollection = db.collection('baskets');
        const basket = await basketCollection.where('id', '==', id).get().then(bk => {
            return bk.docs.map(doc => doc.data() as Basket)[0];
        });

        if (!basket) {
            return res.status(204).send();
        }

        return res.status(200).json({
            data: basket
        });

    } catch (error) {
        return res.status(error.status).json({
            message: error.message
        });
    }
};


/**
 * Return all baskets
 * @param req
 * @param res
 */
// export const getAllBaskets = async (req: Request, res: Response) => {
//     const userId = await FirebaseService.getUserIdFromRequest(req);
//     if (!userId) {
//       return Promise.reject(null);
//     }

//     return await db
//       .collection(BASKET_INDEX_NAME)
//       .doc(userId)
//       .get()
//       .then(async data => {
//         return await res.status(200).json(data.data());
//       })
//       .catch(error => {
//         return res.status(error.code).json({
//           message: `Something went wrong. ${error.message}`
//         });
//       });
//   };




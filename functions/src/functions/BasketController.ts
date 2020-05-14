import { Request, Response } from "express";
import FirebaseService from "../Services/FirebaseService";

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
        const responseSatus: ResponseStatus = await FirebaseService.getAllObjects(req, BASKET_INDEX_NAME);
        return res.status(responseSatus.status).json({
          message: responseSatus.message
        });
      } catch (error) {
        return res.status(error.status).json({
          message: error.message
        });
      }
};


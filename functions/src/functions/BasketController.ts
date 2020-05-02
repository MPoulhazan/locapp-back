import { Request, Response } from "express";
import FirebaseService from "../Services/FirebaseService";

import { ResponseStatus } from "../Models/ResponseStatus/ResponseStatus";

/**
 * function -> Add a basket
 * get /baskets
 */

export const post = async (req: Request, res: Response) => {
    console.log('Add new basket');
    try {
        const responseSatus: ResponseStatus = await FirebaseService.addBasket(
            req
        );
        res.status(responseSatus.status).json({
            message: responseSatus.message
        });
    } catch (error) {
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
    //   try {
    //     const responseSatus: ResponseStatus = await FirebaseService.getAllBaskets(req);
    //     return res.status(responseSatus.status).json({
    //       message: responseSatus.message
    //     });
    //   } catch (error) {
    //     return res.status(error.status).json({
    //       message: error.message
    //     });
    //   }
};


import { Request, Response } from 'express';
import Cart from '../models/Cart';

const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const carts = await Cart.findAll();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch cart.' });
    }
};

const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const cart = await Cart.findAll({ where: { user_id: id } });
        
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
};

const createCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const card = await Cart.create(req.body);
        res.status(201).json(card);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error: card item has not been created" });
    }
};

const updateCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        await Cart.update(req.body, { where: { id: id } });
        res.status(200).json({ message: "Cart updated !" });
    } catch (err) {
        res.status(500).json({ message: "server error the cart has not been updated !" });
    }
};

const deleteCart = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
        const cart = await Cart.findByPk(id);
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        await cart.destroy();

        res.status(200).json({ message: "Cart deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error: Cart could not be deleted" });
    }
};

export {
    getAll,
    createCart,
    updateCart,
    deleteCart,
    getById
};

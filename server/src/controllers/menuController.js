import { PrismaClient } from "@prisma/client"
import fs from "fs"

const prisma = new PrismaClient()

// Tạo 1 món nước mới
export const addItem = async (req, res) => {
    let imageURL = `${req.file.filename}`

    const { name, price, description, categoryId } = req.body
    if (!name || !price || !description || !categoryId || !imageURL) {
        return res.status(400).json({ message: "All fields are required" })
    }
    if (isNaN(price)) {
        return res.status(400).json({ message: "Price must be a number" })
    }
    if (price < 0) {
        return res.status(400).json({ message: "Price must be greater than 0" })
    }

    try {
        const newItem = await prisma.menuItem.create({
            data: { 
                name, 
                price: Number(price), 
                description, 
                categoryId: Number(categoryId), 
                imageURL 
            }
        })
        res.json({ success: true, message: "Added succesfully"})
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error"})
    }
}

export const listItems = async (req, res) => {
    try {
        const items = await prisma.menuItem.findMany()
        res.json(items)
    } catch (error) {
        console.log(error)
        res.json({ message: "Cant get list", error: error.message })
    }
}

export const updateItem = async (req, res) => {
    const { id } = req.params
    const { name, price, description, categoryId } = req.body

    if (!name || !price || !description || !categoryId) {
        return res.status(400).json({ message: "All fields are required" })
    }
    if (isNaN(price)) {
        return res.status(400).json({ message: "Price must be a number" })
    }
    if (price < 0) {
        return res.status(400).json({ message: "Price must be greater than 0" })
    }

    try {
        const updatedItem = await prisma.menuItem.update({
            where: { id: Number(id) },
            data: { 
                name, 
                price: Number(price), 
                description, 
                categoryId: Number(categoryId) 
            }
        })
        res.json(updatedItem)
    } catch (error) {
        console.log(error)
        res.json({ message: "Service unavailable", error: error.message })
    }
}

export const deleteItem = async (req, res) => {
    const { id } = req.params

    try {
        // Lấy thông tin món ăn trước khi xóa để biết tên file ảnh
        const itemToDelete = await prisma.menuItem.findUnique({
            where: { id: Number(id) }
        });
        
        if (!itemToDelete) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        
        // Xóa món ăn khỏi database
        await prisma.menuItem.delete({
            where: { id: Number(id) }
        });
        
        // Xóa file ảnh
        fs.unlink(`uploads/${itemToDelete.imageURL}`, ()=>{})
        
        res.json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
        console.error("Delete item error:", error);
        // Kiểm tra xem lỗi có phải là do không tìm thấy món ăn không
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        res.status(500).json({ success: false, message: "Failed to delete item" });
    }
}
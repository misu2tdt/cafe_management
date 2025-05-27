import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const addItem = async (req, res) => {
    let imageURL = `${req.file.filename}`

    const { name, price, description, categoryId } = req.body
    if (!name || !price || !description || !categoryId || !imageURL) {
        return res.json({ message: "Các mục cần phải điền hết" })
    }
    if (isNaN(price)) {
        return res.json({ message: "Giá phải là một con số" })
    }
    if (price <= 0) {
        return res.json({ message: "Giá phải lớn hơn không" })
    }

    try {
        await prisma.menuItem.create({
            data: { 
                name, 
                price: Number(price), 
                description, 
                categoryId: Number(categoryId), 
                imageURL 
            }
        })
        res.json({ success: true, message: "Thêm thành công"})
    }
    catch (error) {
        console.log(error)
        res.json({ success: false, message: "Lỗi"})
    }
}

export const listItems = async (req, res) => {
    try {
        const items = await prisma.menuItem.findMany({
            where: { isDisable: false }
        })
        res.json(items)
    } catch (error) {
        console.log(error)
        res.json({ message: "Không lấy được danh sách", error: error.message })
    }
}

export const listAllItems = async (req, res) => {
    try {
        const items = await prisma.menuItem.findMany()
        res.json(items)
    } catch (error) {
        console.log(error)
        res.json({ message: "Không lấy được danh sách", error: error.message })
    }
}

export const updateItem = async (req, res) => {
    const { id } = req.params
    const { name, price, description, categoryId } = req.body

    if (!name || !price || !description || !categoryId) {
        return res.json({ message: "Các mục cần phải điền hết" })
    }
    if (isNaN(price)) {
        return res.json({ message: "Giá phải là một con số" })
    }
    if (price < 0) {
        return res.json({ message: "Giá phải lớn hơn không" })
    }

    try {
        const existingItem = await prisma.menuItem.findUnique({
            where: { id: Number(id) }
        })
        
        if (!existingItem) {
            return res.status(404).json({ success: false, message: "Không tìm thấy món" })
        }

        await prisma.menuItem.update({
            where: { id: Number(id) },
            data: { 
                name, 
                price: Number(price), 
                description, 
                categoryId: Number(categoryId) 
            }
        })
        res.json({success: true, message: "Cập nhật món thành công"})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Service unavailable", error: error.message })
    }
}

export const disableItem = async (req, res) => {
    const { id } = req.params

    try {
        const existingItem = await prisma.menuItem.findUnique({
            where: { id: Number(id) }
        })
        
        if (!existingItem) {
            return res.status(404).json({ success: false, message: "Không tìm thấy món" })
        }
        
        await prisma.menuItem.update({
            where: { id: Number(id) },
            data: { isDisable: true }
        })
        
        res.json({ success: true, message: "Đã vô hiệu hóa món thành công" })
    } catch (error) {
        console.error("Disable item error:", error)
        res.status(500).json({ success: false, message: "Vô hiệu hóa món thất bại" })
    }
}

export const enableItem = async (req, res) => {
    const { id } = req.params

    try {
        const existingItem = await prisma.menuItem.findUnique({
            where: { id: Number(id) }
        })
        
        if (!existingItem) {
            return res.status(404).json({ success: false, message: "Không tìm thấy món" })
        }
        
        await prisma.menuItem.update({
            where: { id: Number(id) },
            data: { isDisable: false }
        })
        
        res.json({ success: true, message: "Đã kích hoạt lại món thành công" })
    } catch (error) {
        console.error("Enable item error:", error)
        res.status(500).json({ success: false, message: "Kích hoạt món thất bại" })
    }
}


import express from 'express'
import { addItem, listItems, updateItem, listAllItems, disableItem, enableItem} from '../controllers/menuController.js'
import authMiddleware from '../middlewares/Auth.js'
import multer from 'multer'

const router = express.Router()

// Tạo file chứa ảnh
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage: storage})

router.post('/', authMiddleware, upload.single("imageURL"), addItem)
router.get('/', listItems)
router.get('/list-all', authMiddleware, listAllItems)    
router.put('/:id' , authMiddleware, updateItem)
router.put('/disable/:id', authMiddleware, disableItem)  
router.put('/enable/:id', authMiddleware, enableItem)   

export default router
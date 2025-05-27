import axios from "axios"
import { useEffect, useState, createContext } from "react"

export const ShopContext = createContext(null)

const ShopContextProvider = (props) => {
    const url = "http://localhost:3000"
    const [menuList, setMenuList] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedSize, setSelectedSize] = useState("S")
    
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart")
        return savedCart ? JSON.parse(savedCart) : []
    })
    
    const sizeModifiers = {
        "S": 1,  
        "M": 1.2,  
        "L": 1.4   
    }

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart))
    }, [cart])

    const fetchMenu = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${url}/menuItems`)
            const menuData = response.data
            setMenuList(menuData)
            
            const uniqueCategories = [...new Set(menuData.map(item => item.categoryId))]
            
            const categoryNames = {
                1: "Cà phê",
                2: "Trà trái cây",
                3: "Macchiato & Matcha",
                4: "Trà sữa",
                5: "Đá xay",
                6: "Nước ép"
            }
            
            const formattedCategories = uniqueCategories.map(catId => ({
                id: catId,
                name: categoryNames[catId] || `Category ${catId}`
            }))
            
            setCategories(formattedCategories)
    
            if (formattedCategories.length > 0 && !selectedCategory) {
                setSelectedCategory(formattedCategories[0].id)
            }
            
            setLoading(false)
        } catch (error) {
            console.error("Error fetching menu items:", error)
            setLoading(false)
        }
    }
    
    const getFilteredMenuItems = () => {
        if (!selectedCategory) return menuList
        return menuList.filter(item => item.categoryId === selectedCategory)
    }
    
    const calculatePrice = (basePrice, size) => {
        return Math.round(basePrice * sizeModifiers[size])
    }
    
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(price)
    }

    const calculateCartTotal = (cart) => {
        return cart.reduce((total, item) => {
            return total + (item.price * (item.quantity || 1))
        }, 0)
    }
    
    useEffect(() => {
        async function loadData() {
            await fetchMenu()
        }
        loadData()
    }, [])

    const contextValue = {
        url,
        menuList,
        categories,
        loading,
        selectedCategory,
        setSelectedCategory,
        selectedSize,
        setSelectedSize,
        getFilteredMenuItems,
        calculatePrice,
        formatPrice,
        calculateCartTotal,
        fetchMenu,
        cart,
        setCart
    }
    
    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider
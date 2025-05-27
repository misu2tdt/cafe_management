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
    
    const [cart, setCart] = useState([])
    const [notes, setNotes] = useState({})
    
    const sizeModifiers = {
        "S": 1,  
        "M": 1.2,  
        "L": 1.4   
    }
    useEffect(() => {
        const saved = localStorage.getItem('cart')
        if (saved) {
            const cartItems = JSON.parse(saved)
            setCart(cartItems)
            
            const initialNotes = {}
            cartItems.forEach(item => {
                initialNotes[item.id] = item.note || ''
            })
            setNotes(initialNotes)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    useEffect(() => {
        const saved = localStorage.getItem('cart')
        if (saved) {
            setCart(JSON.parse(saved))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
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

    const addToCart = (item, size, note = "") => {
        const cartItemId = `${item.id}-${size}`
        
        const existingItemIndex = cart.findIndex(
            cartItem => cartItem.id === cartItemId
        )

        if (existingItemIndex >= 0) {
            const updatedCart = [...cart]
            updatedCart[existingItemIndex].quantity = (updatedCart[existingItemIndex].quantity || 1) + 1
            
            if (note && note.trim() !== "") {
                updatedCart[existingItemIndex].note = note
            }

            setCart(updatedCart)
        } else {
            const priceForSize = calculatePrice(item.price, size)
            const newCartItem = {
                id: cartItemId,
                itemId: item.id,
                name: item.name,
                price: priceForSize,
                basePrice: item.price,
                size: size,
                quantity: 1,
                note: note || "",
                imageURL: item.imageURL
            }

            setCart(prev => [...prev, newCartItem])
        }
    }

    const calculateCartTotal = (cartItems = cart) => {
        return cartItems.reduce((total, item) => {
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
        addToCart,
        calculateCartTotal,
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
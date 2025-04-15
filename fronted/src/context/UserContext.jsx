import { createContext, useState } from 'react'

// 1. Create the context
export const UserContext = createContext()

// 2. Create the provider component
export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState({
        fullName: {
          firstName: '',
          lastName: ''
        }
      })
      

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}


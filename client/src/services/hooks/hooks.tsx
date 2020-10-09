import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// type Window = {
//     width: undefined | number
// }

/**
 * Get url query
 * @returns URLSearchParams
 */
export const useQuery = () => {
    return new URLSearchParams(useLocation().search)
}

/**
 * Hook that will get the windows size
 * @returns number | undefined
 */
export const useWindowSize = () => {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState<number | undefined>(undefined)

    useEffect(() => {
        // Handler to call on window resize
        const handleResize = () => {
            // Set window width/height to state
            setWindowSize(window.innerWidth)
        }

        // Add event listener
        window.addEventListener('resize', handleResize)

        // Call handler right away so state gets updated with initial window size
        handleResize()

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize)
    }, []) // Empty array ensures that effect is only run on mount

    return windowSize
}

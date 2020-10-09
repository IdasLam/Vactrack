// import firebase from 'firebase/app'
// import 'firebase/firestore'

import { Article } from '../../models/article'

/**
 * Get one article from database
 * @param articles
 * @returns object
 */
export const getOneArticle = (articles: Article[]) => {
    const articlesCount = Object.keys(articles).length

    const articleRandomIndex = parseInt(Object.keys(articles)[Math.floor(Math.random() * articlesCount)])

    return articles[articleRandomIndex]
}

/**
 * Get two articles from database
 * @param articles
 * @returns array
 */
export const getTwoArticles = (articles: Article[]) => {
    const firstArticle = getOneArticle(articles)
    let secondArticle = getOneArticle(articles)
    let attempts = 0
    const maxAttempts = 1000

    while (firstArticle.title === secondArticle.title) {
        secondArticle = getOneArticle(articles)
        attempts++

        if (attempts > maxAttempts) {
            return []
        }
    }

    return [firstArticle, secondArticle]
}

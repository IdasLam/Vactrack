// import firebase from 'firebase/app'
// import 'firebase/firestore'

import { Article } from '../../models/article'

export const getOneArticle = (articles: Article[]) => {
    const articlesCount = Object.keys(articles).length

    const articleRandomIndex = parseInt(Object.keys(articles)[Math.floor(Math.random() * articlesCount)])

    return articles[articleRandomIndex]
}

export const getTwoArticles = (articles: Article[]) => {
    const firstArticle = getOneArticle(articles)
    let secondArticle = getOneArticle(articles)

    console.log(firstArticle !== secondArticle)

    while (firstArticle.title === secondArticle.title) {
        secondArticle = getOneArticle(articles)
    }

    return [firstArticle, secondArticle]
}

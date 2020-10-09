import React, { FunctionComponent } from 'react'
import * as ArticleTypes from '../../models/article'
import { Button } from '@material-ui/core'
import './article.scss'

type ArticleComponent = {
    articles: ArticleTypes.Article[] | undefined
}

/**
 * Component for article card
 * @param props
 */
const Article: FunctionComponent<ArticleComponent> = (props) => {
    const { articles } = props

    const generateCards = () => {
        return articles?.map((article) => {
            const { link, text, title } = article

            return (
                <Button className="article-container" key={link + text + title}>
                    <a target="__BLANK" href={link}>
                        <p className="title">{title}</p>
                        <p>{text}</p>
                    </a>
                </Button>
            )
        })
    }

    return <div className="featuring-article-container">{generateCards()}</div>
}

export default Article

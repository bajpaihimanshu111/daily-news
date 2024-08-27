import React, {useEffect, useState} from 'react'
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
    
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

    useEffect( () => {
        document.title = `Daily News - ${capitalizeFirstLetter(props.category)}`
        updateNews()
    },[])

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const updateNews = async () => {

        props.setProgress(10)
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&pageSize=${props.pageSize}&page=${page}`

        setLoading(true)

        let data = await fetch(url)
        let parsedData = await data.json();

        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)

        props.setProgress(100)
    }

    const fetchMoreData = async () => {

        setPage(page + 1)

        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&pageSize=${props.pageSize}&page=${page}`

        let data = await fetch(url)
        let parsedData = await data.json();

        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
        setLoading(false)
    };

    return (
        <>
            <h1 className='text-center' style={{margin: '40px 0px', marginTop: '90px' }}>Daily News - Top Headlines on {capitalizeFirstLetter(props.category)}</h1>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={page + 1 <= Math.ceil(totalResults/props.pageSize)}
                loader={<Spinner />}
                >
                <div className='container mt-3'>
                    <div className='row'>
                        {articles.map((element, index)=> {
                            return <div className='col-md-4' key={`${element.title}-${index}`}>
                            <NewsItem title={element.title? element.title : ""} description={element.description ? element.description : ""} imageUrl = {element.urlToImage? element.urlToImage : "https://ichef.bbci.co.uk/images/ic/1200x675/p0gdcnjt.jpg"} newsUrl ={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                        </div>
                        })}
                        
                    </div>
                </div>
            </InfiniteScroll>
        </>
    )
}

News.defaultProps = {
    country: 'in',
    pageSize: 10,
    category: 'general'
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
}

export default News;
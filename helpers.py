import os
import re
import warnings
import groq
import json
import requests
import pandas as pd
from pypdf import PdfReader
from dotenv import load_dotenv, find_dotenv
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain, LLMMathChain
from langchain.document_loaders import UnstructuredURLLoader
from langchain.agents import initialize_agent, Tool, load_tools
from langchain.memory import ConversationBufferMemory
from langchain.docstore.wikipedia import Wikipedia
from langchain.agents.react.base import DocstoreExplorer
from langchain.utilities import GoogleSerperAPIWrapper
from langchain.vectorstores import FAISS
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings

load_dotenv(find_dotenv())
warnings.filterwarnings("ignore")
groq.api_key = os.environ.get("GROQ_API_KEY")
Serper_Api_Key = os.environ.get("Serper_API_KEY")


embedendings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# serp request to get list of relevant news articles
def search_serp(query):
    search = GoogleSerperAPIWrapper(k = 5, type = "search")
    results = search.results(query)
    print(f"response ============> {json.dumps(results, indent=2)}")
    return results

# LLM to choose the best articles and return URLs
def pick_best_articles_urls(query, results):
    # turn json into string
    articles_str = json.dumps(results) 
    # create LLM  to choose best articles
    
    prompt = PromptTemplate(
        input_variables=["query", "articles_str"],
        template="""
        You are a world class Journalist, researcher, software engineer, and news analyst that helps to pick the best news articles based on the query. 
        query response: {articles_str}
        The list of search results :{query}
        Please return the best 3 articles that are relevant to the query and return only array of URLs, don't include anything else -.
        return only the URLs in an array
        also make sure the articles are recent and relevant to the query, if you find any article that is not relevant or not recent, don't include it in the final response.
        if the file or the URL is invalid or not working, don't include it in the final response.
        """,
    )
    llm = ChatGroq(temperature=0.7 , model="llama-3.3-70b-versatile", api_key=os.environ.get("GROQ_API_KEY"))
    chain = LLMChain(llm=llm, prompt=prompt)
    urls = chain.run(query=query, articles_str=articles_str)
    
    # conver string response to list of urls
    urls_str = urls.strip()
    if urls_str.startswith("```json"):
        urls_str = urls_str.split("```json")[1].split("```")[0].strip()
    elif urls_str.startswith("```"):
        urls_str = urls_str.split("```")[1].split("```")[0].strip()
    
    try:
        urls_list = json.loads(urls_str)
    except json.JSONDecodeError:
        urls_list = re.findall(r'https?://[^\s\'"]+', urls)[:3]
    
    print(f"Chosen URLs: {urls_list}")
    
    return urls_list    

# get content for eaach article from the url and return summary for each article
def extract_content_from_url(urls):
    """
    Extract content from URLs with error handling.
    Tries each URL individually and skips failed ones.
    """
    documents = []
    successful_urls = []
    
    for url in urls:
        try:
            print(f"Fetching content from: {url}")
            loader = UnstructuredURLLoader(urls=[url])
            data = loader.load()
            if data:
                documents.extend(data)
                successful_urls.append(url)
                print(f"Successfully loaded: {url}")
        except Exception as e:
            print(f"Error fetching or processing {url}, exception: {e}")
            # Skip this URL and continue with others
            continue
    
    if not documents:
        raise ValueError("Could not extract content from any of the provided URLs. Please try different search terms.")
    
    print(f"Successfully loaded {len(successful_urls)} out of {len(urls)} URLs")
    
    text_splitter = CharacterTextSplitter(separator="\n", chunk_size=1000, chunk_overlap=200, length_function=len)
    split_documents = text_splitter.split_documents(documents)
    
    if not split_documents:
        raise ValueError("No content could be extracted after processing. Please try different search terms.")
    
    db = FAISS.from_documents(split_documents, embedendings)
    return db

# summarize the content of the articles and return the summary
def summarize(db, query, k =4):
    docs = db.similarity_search(query, k=k)
    # join the content of the articles from each document in the list of documents
    docs_page_content = [doc.page_content for doc in docs]
    joined_content = "\n".join(docs_page_content)
    
    llm = ChatGroq(temperature=0.7 , model="llama-3.3-70b-versatile", api_key=os.environ.get("GROQ_API_KEY"))
    
    template = """ 
    {docs}
    You are a world class Journalist, researcher, software engineer, and news analyst that helps to summarize the content of the news articles based on the {query}.
    the newsletter will be sent as an email . the format is going to be like this :
    Title: the title of the newsletter
    Summary: the summary of the newsletter
    the summary should be concise and include the most important information from the articles.
    also make sure to include the most recent and relevant information in the summary, if you find any information that is not relevant or not recent, don't include it in the final summary.
    return the summary in the format mentioned above and make sure to follow the format strictly, don't include anything else in the response except the summary in the format mentioned above.
    please follow these guidelines striclty:
    1- make sure to include the most recent and relevant information in the summary, if you find any information that is not relevant or not recent, don't include it in the final summary.
    2- make sure to return the summary in the format mentioned above and follow the format
    strictly, don't include anything else in the response except the summary in the format mentioned above.
    3- make sure to return the summary in a concise way and include only the most
    important information from the articles, don't include any unnecessary information in the summary.
    4- make sure to return the summary in a way that is easy to read and understand for the readers of the newsletter, use simple language and avoid using technical terms or jargon that might be difficult for the readers to understand.
    """
    
    Prompt_Template = PromptTemplate(input_variables=["docs", "query"], template=template)
    
    summerizer_chain = LLMChain(llm=llm, prompt=Prompt_Template, verbose=True)
    
    response = summerizer_chain.run(docs=joined_content, query=query)
    
    return response.replace("\n", "")

# turn the summary into a newsletter format and return the newsletter
def generate_newsletter(summary, query):
    # you can use the summary to generate a newsletter format using the LLM
    summary_str = str(summary)
    llm = ChatGroq(temperature=0.7 , model="llama-3.3-70b-versatile", api_key=os.environ.get("GROQ_API_KEY"))
    template = """
    You are a world class Journalist, researcher, software engineer, and news analyst that helps to generate a newsletter based on the summary of the news articles and the {query}.
    the newsletter will be sent as an email . the format is going to be like this :
    tim ferris show - episode 1234: the title of the episode
    Summary: the summary of the episode
    the summary should be concise and include the most important information from the articles.
    also make sure to include the most recent and relevant information in the summary, if you find
    any information that is not relevant or not recent, don't include it in the final summary.
    return the newsletter in the format mentioned above and make sure to follow the format strictly, don't include anything else in the response except the newsletter in the format mentioned above.
    please follow these guidelines striclty:
    1- make sure to include the most recent and relevant information in the summary, if you find any information that is not relevant or not recent, don't include it in the final summary.
    2- make sure to return the newsletter in the format mentioned above and follow the format
    strictly, don't include anything else in the response except the newsletter in the format mentioned above.
    3- make sure to return the newsletter in a concise way and include only the most important information from the articles, don't include any unnecessary information in the newsletter.
    4- make sure to return the newsletter in a way that is easy to read and understand for the readers of the newsletter, use simple language and avoid using technical terms or jargon that might be difficult for the readers to understand.
    """    
    prompt = PromptTemplate(input_variables=["summary", "query"], template=template)
    
    new_letter_chain = LLMChain(llm=llm, prompt=prompt, verbose=True)
    news_letter = new_letter_chain.predict(summary=summary_str, query=query)
    return news_letter

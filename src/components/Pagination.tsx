import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";

const Pagination = (props:any) => {

    const [Page, setPage] = useState(1);
    const Limit = props.Limit;
    const Offset = (Page - 1) * Limit;
    useEffect(() => props.setOffset(Offset),[Offset]) // eslint-disable-line react-hooks/exhaustive-deps
    const totalPages = Math.ceil(props.Count / Limit);
    const Pagination = [];

    var startPage = Math.max((Page - 2), 1);
    var endPage = Math.min(totalPages, (Page + 2));

    startPage !== 1 && Pagination.unshift(
    <li className="page-item">
        <Link to="#" className="page-link dark-bg text-white">{"..."}</Link>
    </li>
    );
    for(let i = startPage; i <= endPage; i++){
        Pagination.push(
        <li key={i} className="page-item">
            <Link to="#" onClick={e => i !== Page && setPage(i)} className={ "page-link shadow-none text-white "+(i === Page ? "purple--accent-bg" : "dark-bg") }>{ i }</Link>
        </li>);
    }
    endPage !== totalPages && Pagination.push(
    <li className="page-item">
        <Link to="#" className="page-link dark-bg text-white">{"..."}</Link>
    </li>
    );

    const pageHandler = (e:any, action:any) => {
        e.preventDefault();

        action === 'next'
        ?
        !(Page >= totalPages) && setPage(Page+1)
        :
        !(Page <= 1) && setPage(Page-1)
    }

    return(
        <nav>
            {
            totalPages > 1 &&
            <ul className="pagination justify-content-center position-absolute" style={{bottom:"5px", left:"50%", right:"50%"}}>
                <li className="page-item">
                <Link to="#" onClick={e => pageHandler(e, 'previous')} className="page-link shadow-none dark-bg text-white">
                    <span aria-hidden="true">&laquo;</span>
                </Link>
                </li>
                    <>{ Pagination }</>
                <li className="page-item">
                <Link onClick={e => pageHandler(e, 'next')} className="page-link shadow-none dark-bg text-white" to="#">
                    <span aria-hidden="true">&raquo;</span>
                </Link>
                </li>
            </ul>
            }
        </nav>
    )
}

export default Pagination;
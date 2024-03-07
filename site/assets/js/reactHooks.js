const listClick = (url,text) => (event) => {
    document.title = `DocGen - ${text}`;
    document.querySelector("#page-render").src = url
    localStorage.setItem("lastPage",url)
}

// It's an understatement to say that this is a clusterfuck (but it works)
// Here we loop the whole LINKS file and produce a lovely output on the sidebar
const renderSummary = (summary) => {
    return (
        Object.entries(summary).map(([head, link]) => (
            <ul id={head} className="header">
                {typeof link === "object" ? (
                <>
                    {(Object.keys(link)[0] === "MAIN") ? (
                        <>
                            <h6 className="main-list" id={head} onClick={listClick(Object.values(link)[0],Object.keys(link)[0])}>{head}</h6>
                            {Object.keys(link).length > 1 ? delete link["MAIN"] && renderSummary(link) : null}
                        </>
                        ) :
                        (
                        <>
                            <span className="main-header" id={head}>{head}</span>
                            {renderSummary(link)}
                        </>
                        )}
                    </>
                ) : (
                    <>
                        <li data-ref={link} className="side-list" onClick={listClick(link,head)}>{head}</li>
                    </>
                )}
            </ul>
        ))
    );
  };

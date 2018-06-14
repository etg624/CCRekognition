var dataArr = {  

    "hello": [{
    "id": 114,
    "keyword": "zzzzzz",
    "region": "Sri Lanka",
    "supportGroup": "administrators",
    "category": "Category2"
}, {
    "id": 115,
    "keyword": "aaaaa",
    "region": "Japan",
    "supportGroup": "developers",
    "category": "Category2"
}]

};
var sortArray = dataArr['hello'];
sortArray.sort(function(a,b) {
    if ( a.region < b.region )
        return -1;
    if ( a.region > b.region )
        return 1;
    return 0;
} );

console.log (JSON.stringify(sortArray))
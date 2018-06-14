var arr = [[12, 'AAA'], [12, 'BBB'], [12, 'CCC'],[28, 'DDD'], [18, 'CCC'],[12, 'DDD'],[18, 'CCC'],[28, 'DDD'],[28, 'DDD'],[58, 'BBB'],[68, 'BBB'],[78, 'BBB']];
console.log(arr)

    arr.sort(function(a,b) {
        return a[0]-b[0]
    });

console.log(arr)
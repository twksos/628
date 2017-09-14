function mod(a, b){
    if (a >= 0) return a%b;
    return a%b+b;
}

function genTable(){
    let table = [['',1,2,3,4,5,6,7,8,9,10,11,12,13,14]];
    for(i=1;i<15;i++) {
        table[i] = [i];
        for(j=1;j<15;j++) {
            table[i][j] = mod(i*j, 15);
        }    
    }
    return table;
}

function printTable(table) {
    table.map((row)=>{
        let rowOutput = '';
        row.map(item=>{
            rowOutput += `${item}\t`;
        })
        console.log(rowOutput);
    })
}

printTable(genTable());
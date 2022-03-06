import * as CryptoJS from 'crypto-ts'
class Block{
    public index:number;
    public hash:string;
    public previousHash:string;
    public timestamp:number;
    public data:string;

    constructor(index:number,hash:string,previousHash:string,timestamp:number,data:string) {
        this.index = index;
        this.previousHash=previousHash;
        this.timestamp = timestamp;
        this.data=data;
        this.hash=hash;
    }
}
const calculateHash = (index:number,previousHash:string,timestamp:number,data:string): string =>{
    return CryptoJS.SHA256(index+previousHash+timestamp+data).toString()
}

const calculateHashforBlock = (block:Block):string=>calculateHash(block.index,block.previousHash,block.timestamp,block.data)

const genesisBlock:Block = new Block(0,"dc7e876ace924f53de288e035ddcafd0e13be9c0d60fa6de81f25e7c4ca5e41a",null,202236231,'my block chain start here')

const blockchain:Block[] = [genesisBlock]

const getBlockChain = ():Block[]=> blockchain

const getLatestBlock = ():Block => blockchain[blockchain.length-1]

const getNextBlock = (blockData:string):Block =>{
    const previousBlock = getLatestBlock();
    const nextIndex = previousBlock.index+1;
    const nextTimeStamp = new Date().getTime()/1000
    const nextHash = calculateHash(nextIndex,previousBlock.hash,nextTimeStamp,blockData)
    const newBlock:Block = new Block(nextIndex,nextHash,previousBlock.hash,nextTimeStamp,blockData)
    addBlock(newBlock)
    return newBlock
}

const addBlock = (newBlock:Block)=>{
    if(isValidNewBlock(newBlock,getLatestBlock())){
        blockchain.push(newBlock)
    }
}

const isValidBlockStructure = (block:Block):boolean =>{
    return typeof block.data=== "string"
    && typeof block.hash==='string'
    && typeof block.index==='number'
    && typeof block.previousHash==='string'
    && typeof block.timestamp==='number'
}

const isValidNewBlock = (newBlock:Block,previousBlock:Block):boolean=>{
    if(!isValidBlockStructure(newBlock)){
        console.log('Invalid Structure')
        return false
    }
    if((previousBlock.index+1)!==newBlock.index){
        console.log('Invalid Index')
        return false
    }else if(previousBlock.hash!==newBlock.previousHash){
        console.log('Invalid previousHash')
        return false
    }else if(calculateHashforBlock(newBlock)!==newBlock.hash){
        console.log('Invalid Hash')
        return false
    }
    return true
}
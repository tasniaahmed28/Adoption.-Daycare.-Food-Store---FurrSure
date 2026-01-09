const  markdownInput=document.getElementById('markdown-input');

const htmlOutput=document.getElementById('html-output')

const htmlPreview=document.getElementById('preview')



const syntax={
  heading:['<h1> </h1>','<h2> </h2>','<h3> </h3>' ],
  bold:'<strong> </strong>',
  italic:'<em> </em>'
}
 


function convertMarkdown(){
   let arr=markdownInput.value.split('\n')
  let flag=true;
 
  let returnArr=[];
  console.log(arr,'array')

 
  for (let i=0;i<arr.length;i++){
  const regexArr=checkSyntax(arr);
  const temp=count(arr[i])-1
  
  if (regexArr[0].test(arr[i])){ 
  let string= (regexArr[2]=='0') ?  syntax[regexArr[1]]:syntax[regexArr[1]][temp]
  let value=(regexArr[2]=='0') ? arr[i].replace(/[#*_!]/ig,"").trim():arr[i].replace(/[#]/ig,"").trim()
  console.log('new val',value)
  const nesting=checkNesting(value);
  const updated=string.replace(' ',nesting);
  console.log(updated,'updated') 
  returnArr.push(updated)
  } 

  else{
    flag=false;
  } 
       
  
    
  }
  if(flag==true){return returnArr;}
  else{
    return [markdownInput.value]; 
  }
  
  
   
}


function count(input){
  let counter=0;
  for(let i=0;i<input.length;i++){if(input[i]=='#'){counter+=1}}
  return counter;
}

function checkSyntax(arr){
  const headerRegex=/^#{1,3} .*/i;
  const italicRegex=/^\*.*\*$/;
  const italicRegex2=/^_.*_$/;
  const boldRegex=/^\*\*.*\*\*$/;
  const boldRegex2=/^__.*__$/;
  console.log(arr[0][0],'yp')
  
  if(arr[0][0]=='#'){
    return [headerRegex,'heading',1]
}else if(arr[0][0]=='*' && arr[0][1]!='*'){
  return [italicRegex,'italic',0]
}else if(arr[0][0]=='*' && arr[0][1]=='*'){
  return [boldRegex,'bold',0];
}else if(arr[0][0]=='_' && arr[0][1]!='_'){
  return [italicRegex2,'italic',0] ;
}else if(arr[0][0]=='_' && arr[0][1]=='_'){
  return [boldRegex2,'bold',0];
  }
  return [boldRegex,'pass',0]

}

function checkNesting(value){
  if((value[0]=='_' && value[1]!='_')||(value[0]=='*' && value[1]!='*') ){
    
    const preprocess=value.replace(/[_\*]/g,'')
    return syntax['italic'].replace(' ',preprocess);
  }else if((value[0]=='_' && value[1]=='_')||(value[0]=='*' && value[1]=='*') ){
    
    const preprocess=value.replace(/[_\*]/g,'')
    return syntax['bold'].replace(' ',preprocess);
  }
  
  else{
    return value
  }
}

markdownInput.addEventListener('input',()=>{
  const result=convertMarkdown();
  htmlOutput.textContent=result.join('');
  htmlPreview.innerHTML=result.join('');
})
const boldRegex=/^\*\*.*\*\*$/;
console.log(boldRegex.test('**bold text**'))

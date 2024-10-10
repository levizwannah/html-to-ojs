hljs.highlightAll();
    hljs.addPlugin(new CopyButtonPlugin());

    const copyButton = document.getElementById('copy-button');
    const output = document.getElementById('output');

    document.getElementById('clear-button').onclick = () => {
        input.value = '';
        
        
    }

    function convertToOpenScript(htmlString) {
        const empty = (data) => !data || data.length === 0 || /^[\s\t\n]+$/.test(data);

        if(empty(htmlString)) return '';
        
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        /**
         * @param {Node} node
         * @param {number} indentLevel
         */ 
        function processNode(node, indentLevel = 0) {
            const indentBase = ' '.repeat(indentLevel * 2);
            
            const name = node.nodeName.toLowerCase();
            let attributes = [];
            let children = "";

            if(node.nodeType !== node.TEXT_NODE){
                attributes = Array.from(node.attributes)
                .map(attr => `${attr.name.replace(/-/g, '_')}: "${attr.value}"`);
                    
            }
            else {
                children = node.textContent.replace(/[\n\s]+/g, ' ').trim();
            }

            let attrTxt = "";

            if(attributes.length > 1){
                attrTxt = attributes.join(`,\n${indentBase}    `);
                attrTxt = 
                `${indentBase}  {\n${indentBase}    ${attrTxt}\n ${indentBase}  }`
            }

            if(attributes.length === 1){
                attrTxt = `{${attributes[0]}}`;
            }

            if(node.childNodes){
                for(let child of node.childNodes){
                    
                    let output = processNode(child, indentLevel + 1);
                    if(!empty(children) && !empty(output)) children += ', ';

                    if(child.nodeType === Node.TEXT_NODE && !empty(output) && !empty(attrTxt)){
                        output = `\n${indentBase}  ${output}`;
                    }

                    if(!empty(output)) children +=  output;
                }
            }
            if(attributes.length === 1 && !empty(children)) {
                attrTxt = `${indentBase}  ${attrTxt}`;
            }

            if(!empty(attrTxt) && !empty(children)) {
               attrTxt = `\n${attrTxt},`;
                children = `\n${children}`;
            } 

            if(!empty(children) && attributes.length === 1){
                attrTxt = `${indentBase}  ${attrTxt}`;
            }

            return node.nodeType === Node.TEXT_NODE ? (empty(children) ? null : `"${children}"`) : `\n${indentBase}h.${name}(${attrTxt}${children}${!empty(children) && !empty(attrTxt) ? `\n${indentBase}` : ''})`;
        }

        let output = "";
        
        for(const element of div.childNodes){
            let temp = processNode(element);
            if(empty(temp)) continue; 
            output += temp;
            if(!empty(output)) output += `\n`; 
        }

      
        return output;
       
    }

    const input = document.getElementById('html-input');

    input.value = 
`<div class="container">
    <h1>Hello OpenScript</h1>
    Hi OpenScript
    <span id="span-1" class="span-class-1">This is a span</span>
    <i class="fa-solid far"></i>
    Hi OpenScript 2 
    <div id="data-div" data-bs-name="ojs">
        Ojs is my framework
        <button type="button" id="button-1">Click Me</button>
    </div>
    <p>Hello there ChatGPT</p>
    <br/>
    Final text
</div>`;

    input.oninput = () => {
        output.innerHTML = convertToOpenScript(input.value);
        hljs.highlightAll();
    }

    output.innerHTML = convertToOpenScript(input.value);
   

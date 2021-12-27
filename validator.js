
function Validator(option) {

    var selectorRules = {}
    
    function validate(inputElement,rule){
        
        var errorElement = inputElement.parentElement.querySelector(option.errorSelector)  
        var errorMessage  

        // get all rules of selector
        var rules = selectorRules[rule.selector]
        // for each rule and exam
        // if has error then break
        for(var i = 0;i<rules.length;i++){
            errorMessage = rules[i](inputElement.value)
            if(errorMessage) break;
        }
        

        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('colorError')
        }else{
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('colorError')
        }
    }

    var formElement = document.querySelector(option.form)
    console.log(option.rules)
    if(formElement){
        // bỏ đi hành động mặc định khi submit
        formElement.onsubmit = function(e){
            e.preventDefault()

            // lặp qua từng rule và validate
            option.rules.forEach(function(rule){
                var inputElement = formElement.querySelector(rule.selector)
                validate(inputElement,rule)
            })


        }


        // lặp qua mỗi rules
        option.rules.forEach(function(rule){

            // save all rules for input

            
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElement = formElement.querySelector(rule.selector)
           
            if(inputElement){
                // create case blur from input
                inputElement.onblur = function() {
                    
                   validate(inputElement,rule)
                }
                // create for each user enter input
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector(option.errorSelector)    
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('colorError')
                }
            }
        })
        console.log(selectorRules)

    }


}
Validator.isRequired = function(selector,message) {
    return {
        selector:selector,
        test:function (value) {
            return value.trim() ? undefined  : message || "vui lòng nhập trường này"
        }
    }
}
Validator.isEmail = function(selector) {
    return {
        selector:selector,
        test:function (value) {
           var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
           return regex.test(value) ? undefined : 'please enter that input is email'
        }
    }
}
Validator.minLength = function(selector,min) {
    return {
        selector:selector,
        test:function (value) {
           return value.length >= min ? undefined : `please enter leaser ${min} word`
        }
    }
}



Validator.examPass = function(selector,confirmPass,message){
    return {
        selector:selector,
        test:function (value) {
            console.log(">>>>>>",confirmPass)
          return value == confirmPass ? undefined : message || 'the value enter is not true'
        }
    }
}
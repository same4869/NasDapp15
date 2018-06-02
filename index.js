$(function () {
    var pageId = window.location.search.split("=")[1];
    console.log(pageId);
    var dappContactAddress;
    var serialNumber;
    var NebPay;
    var nebPay;
    var nebulas;
    dappContactAddress = "n21K7yV8aNpXruKgXHUoQFWSDawzfzRTB7M";
    nebulas = require("nebulas"), neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));
    
    NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
    nebPay = new NebPay();	
    var myneb = new Neb();
    var nasApi = myneb.api;	

    var curWallectAdd;


    function getWallectInfo() {
        console.log("getWallectInfo");
        window.addEventListener('message', getMessage);
    
        window.postMessage({
            "target": "contentscript",
            "data": {},
            "method": "getAccount",
        }, "*");
    }
    
    function getMessage(e){
        if (e.data && e.data.data) {
            console.log("e.data.data:", e.data.data)
            if (e.data.data.account) {
                var address = e.data.data.account;
                curWallectAdd = address;
                console.log("address="+address);
            }
        }
    }

    getMediaPlayerInfos();

    function getMediaPlayerInfos(){
        var from = dappContactAddress;
        var value = "0";
        var nonce = "0";
        var gas_price = "1000000";
        var gas_limit = "20000000";
        var callFunction = "getMediaPlayerInfos";
        var callArgs = "";
        // console.log("callFunction:" + callFunction + " callArgs:" + callArgs);
        var contract = {
        "function": callFunction,
        "args": callArgs
        };
    neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        var result = resp.result;   
        console.log("getAllNoteInfo result : " + result);
        result = JSON.parse(result);
        // setItemsProperties(result);
        for(var i = 0; i < result.length; i++){
            if(!result[i].cover || result[i].cover === ""){
                result[i].cover = "mp3/timg.jpg"
            }
        }
        new SMusic({
            musicList:result
        });
    }).catch(function (err) {
        console.log("error :" + err.message);
    })
   }

   function addANewMedia(title,singer,cover,src){
    var to = dappContactAddress;
    var value = "0";
    var callFunction = "addANewMedia";
    var callArgs = "[\"" + title + "\",\"" + singer + "\",\"" + cover + "\",\"" + src + "\"]";
    console.log(callArgs);
    serialNumber = nebPay.call(to, value, callFunction, callArgs, { 
            listener: function (resp) {
                try{
                    if(resp.indexOf("Transaction rejected by user") > 0){
                        alert("您拒绝了合约调用，请重试");
                    }
                }catch(e){
                    var hash = resp.txhash;
                    regetTransactionReceipt(hash, function (status) {
                        if(status == 1){
                            alert('添加音乐成功！');
                            location.reload();
                        }else{
                            alert('添加音乐失败！请重试');
                        }
                    })
                }
                    //upadte card status into in progress...
            }
        }); 
    }

    function regetTransactionReceipt(hash, cb) {
        var task = setInterval(function () {
            getTransactionReceipt(hash, function (resp) {
//                console.log(resp)
                var status = resp.result.status;
                console.log('status:' +status)
                if(status == 1 || status == 0){
                    clearInterval(task);
                    cb(status);
                }
            })
        }, 1000);
    }

    function getTransactionReceipt(hash, cb){
        $.post('https://mainnet.nebulas.io/v1/user/getTransactionReceipt', JSON.stringify({
            "hash": hash
        }), function (resp) {
            console.log(resp);
            cb(resp)
        })
    }

    getWallectInfo();
    
    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('whatever') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this)
        // modal.find('.modal-title').text('New message to ' + recipient)
        // modal.find('.modal-body input').val(recipient)
      })

      $("#submit_sing").on("click", function(event) {
        var song_name = $("#song-name").val();
        var singer = $("#singer-text").val();
        var cover = $("#cover-text").val();
        var src = $("#src-text").val();
        if(song_name && src) {
            $("#song-name").css("border-color","#ced4da");
            $("#src-text").css("border-color","#ced4da");
            addANewMedia(song_name,singer,cover,src);
        } else if (!song_name) {
            $("#song-name").css("border-color","red");
        }else if (!src) {
            $("#src-text").css("border-color","red");
        }
        
    });
})
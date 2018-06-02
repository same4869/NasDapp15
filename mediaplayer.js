var MediaPlayerItems = function () {
    LocalContractStorage.defineMapProperty(this, "mediaplayers", {
        parse: function (text) {
            return new MediaPlayerItem(text);
        },
        stringify: function (o) {
            return JSON.stringify(o);
        }
    });
    LocalContractStorage.defineProperty(this, "size");
};

var MediaPlayerItem = function(text){
    if(text){
        var obj = JSON.parse(text);
       this.from = obj.from;
       this.title = obj.title;
       this.singer = obj.singer;
       this.cover = obj.cover;
       this.src = obj.src;
    }
};

MediaPlayerItem.prototype = {
    toString : function(){
        return JSON.stringify(this)
    }
};



MediaPlayerItems.prototype ={
    init:function(){
        this.size = 0
    },

    addANewMedia:function(title,singer,cover,src){
        var from = Blockchain.transaction.from;

        var id = this.size;
        var mediaplayer = this.mediaplayers.get(id);
        if (!mediaplayer) {
            mediaplayer = {};
            mediaplayer.title = title;
            mediaplayer.singer = singer;
            mediaplayer.cover = cover;
            mediaplayer.src = src;
            this.size += 1
            LocalContractStorage.set("size", this.size);
        }

        this.mediaplayers.put(id,mediaplayer);
    },

    getMediaPlayerById:function(id){
        if(!id){
            throw new Error("没查到这个玩家")
        }
        return this.mediaplayers.get(id);
    },

    getMediaPlayerInfos:function(){
        this.size = LocalContractStorage.get("size", this.size);
        var info = []
        for(var i = 0; i < this.size; i++){
            info.push(this.mediaplayers.get(i))
        }
        return info;
    }
}

module.exports = MediaPlayerItems;


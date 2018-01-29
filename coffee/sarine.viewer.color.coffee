
class SarineColor extends Viewer

  constructor: (options) ->
    super(options)
    @isAvailble = true
    @colorGradeMaps = {
      1: "D",2:"E",3:"F",4:"G", 5:"H" , 6:"I", 7:"J",8:"K", 9: "L",10:"M",11:"N",12:"O-P",13:"Q-R", 14:"S-T",15:"U-V",16: "W-X",17:"Y-Z"
    }
    @keysToIndex= {      "D": 1,      "E" :2,      "F" :3,      "G" :4,      "H" :5,      "I" :6,      "J" :7,      "K" :8,      "L" :9,      "M" :10,      "N" :11,      "OP":12,      "QR":13,      "ST":14,      "UV":15,      "WX":16,      "YZ":17    }
    @resourcesPrefix = options.baseUrl + "atomic/v1/assets/"
    @colorAssets = options.baseUrl + "atomic/v1/js/color-assets/clean"
    @atomConfig = configuration.experiences.filter((exp)-> exp.atom == "colorExperience")[0]
    if(!@atomConfig)
      @atomConfig  = configuration.experiences.filter((exp)-> exp.atom == "customHtml")[0]

    @resources = [
      {element:'link', src: @resourcesPrefix + 'owl.carousel' + (if location.hash.indexOf("debug") == 1 then ".css" else ".min.css") + window.cacheVersion},
      #{element:'link'   ,src:'owl.theme.default.css'},
      {element:'script', src: @resourcesPrefix + 'owl.carousel' + (if location.hash.indexOf("debug") == 1 then ".js" else ".min.js") + window.cacheVersion}

    ]
    #css = '.owl-carousel {width: ' + @atomConfig.ImageSize.width + 'px; height: ' + @atomConfig.ImageSize.height + 'px}'
    #css += '.spinner {margin-top: 40% !important}'
    css =  '.owl-carousel .item{margin:2px;border-color: gray;cursor: pointer; border: 2px; border-radius: 3px; box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.2); -webkit-transition: all 200ms ease-out;-o-transition: all 200ms ease-out; transition: all 200ms ease-out; font: initial; }'
    css += '.owl-carousel .item img{  display: block;  width: 110%;  margin-left: -5%;  height: auto; }'
    css += '.owl-carousel  .owl-item{position:initial;}'
    css += ".owl-item.active.center{ -webkit-transform: scale(1.3);-ms-transform: scale(1.3);transform: scale(1.3); background: white;  z-index: 10000; position: relative;}"
    css+=  '.owl-stage {height:300px;padding-top:20px;}';
    css+=  '.owl-stage-outer {max-height:130px;    padding-top: 40px;}';
    head = document.head || document.getElementsByTagName('head')[0]
    style = document.createElement('style')
    style.type = 'text/css'
    if (style.styleSheet)
      style.styleSheet.cssText = css
    else
      style.appendChild(document.createTextNode(css))
    head.appendChild(style)

    @domain = window.coreDomain
    @numberOfImages =@atomConfig && @atomConfig.NumberOfImages || 17

  convertElement : () ->
    @element.append '<div class="owl-carousel owl-theme"></div>'

  first_init : ()->
    defer = $.Deferred()
    _t = @

    @stoneColor = window.stones[0].stoneProperties.color
    if(!_t.keysToIndex.hasOwnProperty(@stoneColor))
        @failed()
        defer.resolve(@)
    else
      @loadAssets (@resources), ()->

        @pattern = _t.atomConfig && _t.atomConfig.ImagePatternClean || 'colorscalemaster-stacked_*.png'
        @firstImageName = @pattern.replace("*","1")
        src =  _t.colorAssets + "/" + @firstImageName + cacheVersion

        _t.loadImage(src).then((img)->
          if img.src.indexOf('data:image') == -1 && img.src.indexOf('no_stone') == -1
            defer.resolve(_t)
          else
            _t.isAvailble = false
            _t.element.empty()
            @div  =  $("<div>")
            @div.attr {'style' : 'background-color:gray;width:150px;margin:0 auto;'}
            @canvas = $("<canvas>")
            @canvas[0].width = img.width
            @canvas[0].height = img.height
            @ctx = @canvas[0].getContext('2d')
            @ctx.drawImage(img, 0, 0, img.width, img.height)
            @canvas.attr {'class' : 'no_stone'}
            @div.append(@canvas)
            _t.element.append(@div)
            defer.resolve(_t)
          return  
        )
    defer

  failed : () ->
    _t = @
    defer = $.Deferred()
    _t.loadImage(_t.callbackPic).then (img)->
      _t.isAvailble = false
      _t.element.empty()
      @canvas = $("<canvas>")
      @canvas[0].width = img.width
      @canvas[0].height = img.height
      @ctx = @canvas[0].getContext('2d')
      @ctx.drawImage(img, 0, 0, img.width, img.height)
      @canvas.attr {'class' : 'no_stone'}

      _t.element.append(@canvas)
      defer.resolve(_t)
  full_init : ()->
    defer = $.Deferred()
    _t = @
    @stoneColor = window.stones[0].stoneProperties.color
    if(_t.keysToIndex.hasOwnProperty(@stoneColor))
      @owlCarousel = @element.find('.owl-carousel')
      @imagePath =  @colorAssets + "/"

      _atomName =   if _t.atomConfig.atom == 'colorExperience'  then  _t.atomConfig.atom  else   _t.atomConfig.id
      _cssElement = $('.slide.slide--'+_atomName).find('.slide__content--colorExperience')
      _cssElement.removeClass('slide__content')
      $('.slide.slide--'+_atomName).find('.slide__content--'+_atomName).removeClass('slide__content')
      @pattern = @atomConfig && @atomConfig.ImagePatternClean || 'colorscalemaster-stacked_*.png'
      @filePrefix = @pattern.replace(/\*.[^/.]+$/,'')
      @fileExt = ".#{@pattern.split('.').pop()}"
      i=1
      while i <= @numberOfImages
          @newPath = @imagePath+@filePrefix+i+@fileExt
          @container = $("<div>")
          @container.attr({class : "item"})
          newImage = $("<img>")
          newImage.attr({src: @newPath})
          newSpan = $("<span>").html( @colorGradeMaps[i])
          newSpan.attr({class : "color-grade-span"})
          @container.append(newSpan)
          @container.append(newImage)
          @owlCarousel.append(@container)
          i++


      @owlCarousel.owlCarousel({
        center: true,
        onDragged : (event)->
          console.log('owl carousel dragged ' + event)
          $('.owl-item.active.center span').html '<span>'+$('.owl-item.active.center span').html()+'</span>'

        onInitialized : (elem)->
          console.log('owl carousel initialized')
          _this = elem
          setTimeout (->
            @stoneColor = window.stones[0].stoneProperties.color
            _indexOfStone = _t.keysToIndex[@stoneColor]
            $('.owl-carousel').trigger('to.owl.carousel',_indexOfStone-1))
          , 200

        ##afterMove: () ->
        ##  $('owl-item').css({transform:"none"})
        ##  $('active').eq(1).css({transform:"scale(1.9)",zIndex:3000})
        onReady: () ->
          defer.resolve(@)
      });
    else
      defer.resolve(@)

    defer

  play : () -> return
  stop : () -> return

@SarineColor = SarineColor
var Shopify = Shopify || {};
// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
Shopify.money_format = "${{amount}}";
Shopify.formatMoney = function(cents, format) {
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);

  function defaultOption(opt, def) {
    return (typeof opt == 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) { return 0; }

    number = (number/100.0).toFixed(precision);

    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};
//PDP main image replace
$("document").ready(function() {
  setTimeout(function() {
    $("ul.product-single__thumbnails li:nth-child(2) img , ul.product-single__thumbnails li:nth-child(2) button").trigger('click');
  },10);
  //Discount-popup
  $(".hover_bkgr_fricc").css("display","none");
  $('.hover_bkgr_fricc').click(function(e){
    if (!$(e.target).closest('.custom-size-img').length) {
      $(".hover_bkgr_fricc").css("display","none");
    };
  });
  $('.popupCloseButton').click(function(){
    $('.hover_bkgr_fricc').hide();
  });
});
//discount-popup
$(document).on('click', '.add_toCart', function (e) { 
  e.preventDefault();
  var id= $(this).parents('.product-form').find('.qty').val();
  var variant= parseInt($('.product-form').find("[name='id']").val());

  addItemToCart(id,variant);
  $('.pdp_discount').hide();
});

function addItemToCart(id, variant) {
  //alert(vairiant1);
  data = {
    "quantity": id,
    "id": variant
  }
  jQuery.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: data,
    dataType: 'json',
    success: function() {
      $.ajax({
        type: 'GET',
        url: '/cart.json',
        dataType: "json",
        success: function (data) {
          if ($(window).width() < 600){
            $('#CartCount span').html(data.item_count);
          }
          else{
            $('#CartCost').html(Shopify.formatMoney(data.total_price));
          }
          
          var puzzle_count = 0;
          $.each(data.items, function(index, cartItem) {
            var vartype = cartItem.product_type;
            if(vartype == 'Puzzle'){
              puzzle_count = puzzle_count + cartItem.quantity;
            }
          });
          var puzzle_count = parseInt(puzzle_count);
          if(puzzle_count == 1)
          {
            $('.content_border1').addClass('bg_coloradd');
            $(".tooltip img").css({'left': '30%'});
            $('.hover_bkgr_fricc').fadeIn();
            $(".subtext span").replaceWith("<span>10% Discount</span>");
            $('.background-image_withtext').attr('data-step', '1');
          }
          else if(puzzle_count == 2)
          {
            $('.content_border1').addClass('bg_coloradd');
            $('.content_border2').addClass('bg_coloradd');
            $(".tooltip img").css({'left': '45%'});
            $(".subtext span").replaceWith("<span>20% Discount</span>");
            $('.hover_bkgr_fricc').fadeIn();
            $('.background-image_withtext').attr('data-step', '2');
          }
          else if(puzzle_count == 3)
          {
            $('.content_border1').addClass('bg_coloradd');
            $('.content_border2').addClass('bg_coloradd');
            $('.content_border3').addClass('bg_coloradd');
            $(".tooltip img").css({'left': '60%'});
            $(".subtext span").replaceWith("<span>25% Discount</span>");
            $('.hover_bkgr_fricc').fadeIn();
            $('.background-image_withtext').attr('data-step', '3');

          }
          else if(puzzle_count >= 4)
          {
            $('.subtext , .slider_section').hide();
            $('.hover_bkgr_fricc').fadeIn();
            $('.hover_bkgr_fricc').addClass('custom-content_height');
            $('.background-image_withtext').attr('data-step', '4');
          }
          else
          {
            $('.content_border1,.content_border2,.content_border3,.content_border4').removeClass('bg_coloradd');
            $('.hover_bkgr_fricc').fadeOut();
            $('.hover_bkgr_fricc').removeClass('custom-content_height');
          }
        },
        failure: function (data) {
          //alert(data.d);
        }
      });
    }
  });
}

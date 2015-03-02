###

itemId: '331487549500',
  title: 'Apple iPhone 6 - 64GB - Gold (AT&T) - New in Box!',
  globalId: 'EBAY-US',
  primaryCategory:
   { categoryId: '9355',
     categoryName: 'Cell Phones & Smartphones' },
  galleryURL: 'http://thumbs1.ebaystatic.com/m/mOej-YKFvOB64DEv1fGmftA/140.jpg',
  viewItemURL: 'http://www.ebay.com/itm/Apple-iPhone-6-64GB-Gold-AT-T-New-Box-/331487549500?pt=LH_DefaultDomain_0',
  productId: { ReferenceID: '203704539' },
  paymentMethod: 'PayPal',
  autoPay: 'false',
  postalCode: '15102',
  location: 'Bethel Park,PA,USA',
  country: 'US',
  shippingInfo:
   { shippingType: 'Calculated',
     shipToLocations: 'US',
     expeditedShipping: 'true',
     oneDayShippingAvailable: 'false',
     handlingTime: '2' },
  sellingStatus:
   { currentPrice: { USD: '670.0' },
     convertedCurrentPrice: { USD: '670.0' },
     bidCount: '34',
     sellingState: 'Active',
     timeLeft: 'P0DT0H30M9S' },
  listingInfo:
   { bestOfferEnabled: 'false',
     buyItNowAvailable: 'false',
     startTime: '2015-02-24T03:55:41.000Z',
     endTime: '2015-03-02T15:55:41.000Z',
     listingType: 'Auction',
     gift: 'false' },
  returnsAccepted: 'false',
  condition: { conditionId: '1000', conditionDisplayName: 'New' },
  isMultiVariationListing: 'false',
  topRatedListing: 'false'

###

Base = require './base'

class Smartphone extends Base
    parse: (title) ->
        colorRegex  = /blue|green|gold|white|yellow|black|silver|gray|grey|cyan|pink|fuchsia/ig
        storageRegex   = /[0-9]{2,3}gb/ig
        subscrRegex = /at&t|verizon/ig

        color   = title.match(colorRegex)
        storage = title.match(storageRegex)
        subscr  = title.match(subscrRegex)

        if color
            color = color[0]
        if storage
            storage = storage[0]
        if subscr
            subscr = subscr[0]
        else
            subscr = 'unlocked'

        {
            color   : color
            storage : storage
            subscr  : subscr.toUpperCase()
        }

module.exports = Smartphone
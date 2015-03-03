###

10 items found:
Samsung 24" S24D590PL Full HD 1080p LED PLS Widescreen Monitor
ASUS MS238H 23" Full HD Ultra-Slim Widescreen HDMI LED Monitor
Dell P2011H Black 20" 5ms Widescreen LED Backlight LCD Monitor
Dell D2015H Black 20" VA Panel Widescreen LED Backlight LCD Monitor
Samsung S27D360H 27" LED Monitor White w/ Blue ToC Finish Full 1080p
Samsung SyncMaster T240HD 24" Computer Monitor/HDTV
Dell 24" DVI/VGA 1080p Widescreen LED LCD Computer/Desktop Flat Screen Monitor
Dell 22" Full HD Widescreen LED Monitor #E2215HV
Dell S2340M DVI 1080p 23" Widescreen Ultra-Slim IPS LED LCD Monitor - Black
Dell 2005FPW 20.1" LCD flat screen monitor w/ cords

###

colors = require 'colors'
Base   = require './base'

class Monitor extends Base

    parse: (title) ->
        sizeRegex    = /[0-9]{2}("|[- ]?inch(es)?)/ig
        colorRegex   = /blue|green|gold|white|yellow|black|silver|gray|grey|cyan|pink|fuchsia/ig
        manufRegex   = /samsung|asus|aoc|dell|lg|philips/ig
        resRegex     = /fullhd|4k|[0-9]{4}x[0-9]{4}/ig

        color        = title.match colorRegex
        size         = title.match sizeRegex
        manufacturer = title.match manufRegex
        resolution   = title.match resRegex

        if size         then size         = size[0]         else size         = 'Unknown'
        if color        then color        = color[0]        else color        = 'Unknown'       
        if resolution   then resolution   = resolution[0]   else resolution   = 'Unknown'  
        if manufacturer then manufacturer = manufacturer[0] else manufacturer = 'Unknown'

        {
            color        : color
            size         : size
            resolution   : resolution
            manufacturer : manufacturer
        }

    summarize: ->
        report = []
        
        props = [
            [       'Color', @parsed.color       ],
            [        'Size', @parsed.size        ],
            [  'Resolution', @parsed.resolution  ],
            ['Manufacturer', @parsed.manufacturer]
        ]

        for prop in props
            report.push @formatProperty prop[0], prop[1]

        super report

module.exports = Monitor
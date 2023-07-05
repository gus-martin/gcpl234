var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, sankeyLeft } from 'd3-sankey';
import { FunctionalColor, GreyscaleColor, HighlightColor } from '../colors';
import { handleErrors, postMessageToGrandparent, getAbbreviatedNumber } from '../utils';
import { CustomVisualization, DropStage, CustomVisMessageType, } from '../types';
import { dropStageFailureDescriptions, dropStageSuccessDescriptions, DROP_STAGE_DESCRIPTIONS, FINAL_OUTCOMES, HIDE_DONUT_CHART_MSG, HIDE_ICON_PATHS, SHOW_MORE_ICON_PATH, } from '../data';
var HANDSHAKE_MESSAGE = {
    type: CustomVisMessageType.CUSTOM_VIS_HANDSHAKE,
    payload: CustomVisualization.SANKEY_CHART,
};
var D3_GREEN = d3.color(FunctionalColor.GREEN);
var D3_RED = d3.color(FunctionalColor.RED);
var VERTICAL_BAR_EXTENSION = 8;
var MARGIN_LEFT = 28;
var MARGIN_RIGHT = 150;
var VERTICAL_MARGIN = 20;
var NODE_WIDTH = 12;
var SHOW_DETAIL_STAGES = [DropStage.TARGET_MATCH, DropStage.POST_PROCESSING];
var showDetailValues = SHOW_DETAIL_STAGES.map(function (stage) { return DROP_STAGE_DESCRIPTIONS[stage].failure; });
var showDetailColumnMapping = SHOW_DETAIL_STAGES.reduce(function (columnMapping, stage) {
    columnMapping[DROP_STAGE_DESCRIPTIONS[stage].failure] = stage;
    return columnMapping;
}, {});
var shouldRenderShowDetails = function (value) { return showDetailValues.includes(value); };
var failureSet = new Set(dropStageFailureDescriptions);
var successSet = new Set(dropStageSuccessDescriptions);
var vis = {
    id: 'sankey',
    label: 'Sankey',
    options: {
        hiddenDimensions: {
            type: 'array',
            label: 'Hidden Dimensions',
            default: [],
        },
        selectedDropStage: {
            type: 'string',
            label: 'Selected Drop Stage',
            default: DropStage.TARGET_MATCH,
        },
    },
    // Set up the initial state of the visualization
    create: function (element) {
        element.style.backgroundColor = GreyscaleColor.PINE;
        element.innerHTML = "\n            <style>\n                @import url(https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,400italic,600italic,700italic&subset=latin);\n\n                .node,\n                .text-box,\n                .link {\n                    transition: 0.5s all;\n                }\n            </style>\n        ";
        this.svg = d3.select(element).append('svg');
        postMessageToGrandparent(HANDSHAKE_MESSAGE);
    },
    // Render in response to the data or settings changing
    updateAsync: function (data, element, config, queryResponse, _details, doneRendering) {
        var _a;
        console.log('[sankey] updateAsync()', { config: config });
        if (!handleErrors(this, queryResponse, data, {
            min_pivots: 0,
            max_pivots: 0,
            min_dimensions: 2,
            max_dimensions: undefined,
            min_measures: 1,
            max_measures: 1,
        })) {
            doneRendering();
            console.log('[sankey] updateAsync() early return');
            return;
        }
        if (this.clearDropStageListener) {
            window.removeEventListener('message', this.clearDropStageListener);
        }
        this.clearDropStageListener = function (messageEvent) {
            console.log('[sankey] clearDropStageListener()', messageEvent);
            if (vis.trigger && messageEvent.data.type === CustomVisMessageType.CLEAR_SELECTED_DROP_STAGE) {
                console.log('[sankey] vis.trigger("updateConfig")', [{ selectedDropState: '' }]);
                vis.trigger('updateConfig', [{ selectedDropStage: '' }]);
            }
        };
        window.addEventListener('message', this.clearDropStageListener);
        var width = element.clientWidth;
        var height = element.clientHeight;
        var svg = this.svg.html('').attr('width', '100%').attr('height', '100%').append('g');
        var dimensions = queryResponse.fields.dimension_like;
        var filteredDimensions = dimensions.filter(function (dim) { var _a, _b; return !((_b = (_a = config.hiddenDimensions) === null || _a === void 0 ? void 0 : _a.includes(dim.name)) !== null && _b !== void 0 ? _b : false); });
        var columns = filteredDimensions.slice(0, -1);
        var measure = queryResponse.fields.measure_like[0];
        var defs = svg.append('defs');
        var RED_GRADIENT = 'RED_GRADIENT';
        var redGradient = defs
            .append('linearGradient')
            .attr('id', RED_GRADIENT)
            .attr('gradientUnits', 'userSpaceOnUse');
        redGradient
            .append('stop')
            .attr('class', 'start')
            .attr('offset', '0%')
            .attr('stop-color', '#EB8F8F')
            .attr('stop-opacity', 1);
        redGradient
            .append('stop')
            .attr('class', 'end')
            .attr('offset', '100%')
            .attr('stop-color', '#E25454')
            .attr('stop-opacity', 1);
        var GREEN_RED_GRADIENT = 'GREEN_RED_GRADIENT';
        var greenRedGradient = defs
            .append('linearGradient')
            .attr('id', GREEN_RED_GRADIENT)
            .attr('gradientUnits', 'userSpaceOnUse');
        greenRedGradient
            .append('stop')
            .attr('class', 'start')
            .attr('offset', '0%')
            .attr('stop-color', D3_GREEN)
            .attr('stop-opacity', 1);
        greenRedGradient
            .append('stop')
            .attr('class', 'end')
            .attr('offset', '100%')
            .attr('stop-color', D3_RED)
            .attr('stop-opacity', 1);
        var BOX_SHADOW = 'BOX_SHADOW';
        defs.append('filter')
            .attr('id', BOX_SHADOW)
            .append('feDropShadow')
            .attr('dx', 0)
            .attr('dy', 2)
            .attr('stdDeviation', 2)
            .attr('flood-color', 'rgba(0,0,0,0.16)');
        var sankeyInst = sankey()
            .nodeAlign(sankeyLeft)
            .nodeWidth(NODE_WIDTH)
            .nodePadding(42)
            .extent([
            [MARGIN_LEFT, VERTICAL_MARGIN],
            [width - MARGIN_RIGHT, height - 2 * VERTICAL_MARGIN],
        ]);
        // TODO: Placeholder until @types catches up with sankey
        var newSankeyProps = sankeyInst;
        newSankeyProps.nodeSort(null);
        newSankeyProps.linkSort(null);
        var columnWidth = (width - MARGIN_RIGHT - MARGIN_LEFT) / columns.length;
        var addColumnDivider = function (idx) {
            return svg
                .append('rect')
                .attr('x', MARGIN_LEFT + (columnWidth - 1.8) * idx + NODE_WIDTH / 2 - 1)
                .attr('y', 0)
                .attr('height', height - VERTICAL_MARGIN)
                .attr('width', 2)
                .attr('fill', GreyscaleColor.ASH);
        };
        columns.forEach(function (_text, idx) {
            addColumnDivider(idx);
        });
        // divider for right side of final column
        addColumnDivider(columns.length);
        var link = svg.append('g').attr('class', 'links').attr('fill', 'none').attr('stroke', '#fff').selectAll('path');
        var spillCovers = svg.append('g');
        var node = svg
            .append('g')
            .attr('class', 'nodes')
            .attr('font-family', 'Open Sans, sans-serif')
            .attr('font-size', 14)
            .selectAll('g');
        var hoverColumn = svg.append('g');
        var textBox = svg
            .append('g')
            .attr('class', 'text-boxes')
            .attr('font-family', 'Open Sans, sans-serif')
            .attr('font-size', 14)
            .selectAll('g');
        var graph = {
            nodes: [],
            links: [],
        };
        var nodes = d3.set();
        var getRowSuccessCount = function (row) {
            return Object.values(row).filter(function (item) { return successSet.has(item.value); }).length;
        };
        // sort by number of successes
        data.sort(function (a, b) { return getRowSuccessCount(a) - getRowSuccessCount(b); });
        data.forEach(function (d, di) {
            // variable number of dimensions
            var path = filteredDimensions
                .filter(function (dim) { return d[dim.name].value !== null; })
                .map(function (dim) { return d[dim.name].value; });
            path.forEach(function (p, i) {
                if (i === path.length - 1) {
                    return;
                }
                var source = p + i + "len:".concat(p.length);
                var nextNode = path[i + 1];
                var target = FINAL_OUTCOMES.includes(nextNode)
                    ? nextNode
                    : nextNode + (i + 1) + "len:".concat(nextNode.length);
                nodes.add(source);
                nodes.add(target);
                graph.links.push({
                    source: source,
                    target: target,
                    value: +d[measure.name].value,
                });
            });
        });
        var nodesArray = nodes.values();
        graph.links.forEach(function (d) {
            d.source = nodesArray.indexOf(d.source);
            d.target = nodesArray.indexOf(d.target);
        });
        graph.nodes = nodes.values().map(function (d) { return ({
            name: d.slice(0, d.split('len:')[1]),
        }); });
        sankeyInst(graph);
        var g = link.data(graph.links).enter().append('g');
        var pathFn = sankeyLinkHorizontal();
        g.append('path')
            .attr('d', pathFn)
            .attr('stroke-width', function (d) { return Math.max(1, d.width); })
            .attr('stroke', 'white')
            .style('opacity', function (d) { return (d.width === 0 ? 0 : 1); });
        g.append('path')
            .attr('class', 'link')
            .attr('d', pathFn)
            .attr('stroke-width', function (d) { return Math.max(1, d.width) + 0.5; })
            .style('opacity', function (d) {
            if (d.width === 0) {
                return 0;
            }
            if (!failureSet.has(d.source.name)) {
                return 0.05 * d.source.depth + 0.4;
            }
            return 1;
        })
            .style('stroke', function (d) {
            if (successSet.has(d.source.name) && failureSet.has(d.target.name)) {
                return "url(#".concat(GREEN_RED_GRADIENT, ")");
            }
            return failureSet.has(d.source.name) ? "url(#".concat(RED_GRADIENT, ")") : D3_GREEN;
        });
        node = node.data(graph.nodes).enter().append('g').attr('class', 'node');
        textBox = textBox.data(graph.nodes).enter().append('g').attr('class', 'text-box');
        // render bars
        node.append('rect')
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0 - VERTICAL_BAR_EXTENSION; })
            .attr('height', function (d) { return Math.abs(d.y1 - d.y0) + VERTICAL_BAR_EXTENSION * 2; })
            .attr('width', function (d) { return Math.abs(d.x1 - d.x0); })
            .attr('fill', function (d) { return (failureSet.has(d.name) ? D3_RED : D3_GREEN); })
            .style('opacity', function (d) { return (d.value === 0 ? 0 : 1); })
            .attr('rx', 2);
        columns.forEach(function (column, idx) {
            var g = hoverColumn.append('g');
            g.append('text')
                .attr('class', 'column-label')
                .attr('x', MARGIN_LEFT + columnWidth * idx + columnWidth / 2)
                .attr('y', height - 3)
                .attr('text-anchor', 'middle')
                .text(column.label_short.toUpperCase())
                .attr('font-family', 'Open Sans, sans-serif')
                .attr('font-size', 11)
                .attr('font-weight', '600')
                .attr('fill', GreyscaleColor.AMARANTO)
                .style('user-select', 'none');
            if (!idx && columns.length > 2) {
                var hoverGroup = g.append('g').attr('class', 'hover-group').attr('opacity', 0);
                g.on('mouseover', function () {
                    d3.select(this).style('cursor', 'pointer');
                    d3.select(this).select('.hover-group').attr('opacity', 1);
                    d3.select(this).select('.column-label').attr('fill', FunctionalColor.BLUE);
                });
                g.on('mouseout', function () {
                    d3.select(this).style('cursor', 'default');
                    d3.select(this).select('.hover-group').attr('opacity', 0);
                    d3.select(this.parentNode).select('.column-label').attr('fill', GreyscaleColor.AMARANTO);
                });
                g.on('click', function () {
                    console.log('[sankey] handling hide column (?) click');
                    d3.event.stopPropagation();
                    if (vis.trigger) {
                        // this is not triggering a re-render
                        console.log('[sankey] vis.trigger("updateConfig")', [{ hiddenDimensions: __spreadArray(__spreadArray([], config.hiddenDimensions, true), [column.name], false) }]);
                        vis.trigger('updateConfig', [{ hiddenDimensions: __spreadArray(__spreadArray([], config.hiddenDimensions, true), [column.name], false) }]);
                    }
                });
                hoverGroup
                    .append('rect')
                    .attr('x', MARGIN_LEFT)
                    .attr('y', 0)
                    .attr('height', height - VERTICAL_MARGIN)
                    .attr('width', columnWidth + NODE_WIDTH - 2)
                    .attr('fill', 'white')
                    .attr('opacity', 0.4);
                var hideValuesLabelHeight_1 = 26;
                var hideValuesLabelWidth_1 = 106;
                var hideValuesGroup_1 = hoverGroup.append('g').attr('class', 'hide-values-label');
                hideValuesGroup_1
                    .append('rect')
                    .attr('height', hideValuesLabelHeight_1)
                    .attr('width', hideValuesLabelWidth_1)
                    .attr('rx', 5)
                    .attr('fill', GreyscaleColor.EBONY);
                var hideValuesIcon_1 = hideValuesGroup_1.append('g').attr('transform', 'translate(8, 6)');
                HIDE_ICON_PATHS.forEach(function (path) {
                    return hideValuesIcon_1.append('path').attr('d', path).attr('fill', GreyscaleColor.MAPLE);
                });
                hideValuesGroup_1
                    .append('text')
                    .attr('x', 32)
                    .attr('y', 17)
                    .attr('font-weight', '400')
                    .attr('font-size', 12)
                    .attr('font-family', 'Open Sans, sans-serif')
                    .attr('fill', GreyscaleColor.MAPLE)
                    .attr('user-select', 'none')
                    .text('Hide Values');
                g.on('mousemove', function () {
                    var _a = d3.mouse(g.node()), _mouseX = _a[0], mouseY = _a[1];
                    var yCoord = mouseY - hideValuesLabelHeight_1 / 2;
                    hideValuesGroup_1.attr('transform', "translate(".concat(MARGIN_LEFT + columnWidth / 2 - hideValuesLabelWidth_1 / 2, ", ").concat(yCoord, ")"));
                });
                g.on('mouseenter', function () {
                    var _a = d3.mouse(g.node()), _mouseX = _a[0], mouseY = _a[1];
                    var yCoord = mouseY - hideValuesLabelHeight_1 / 2;
                    hideValuesGroup_1.attr('transform', "translate(".concat(MARGIN_LEFT + columnWidth / 2 - hideValuesLabelWidth_1 / 2, ", ").concat(yCoord, ")"));
                });
            }
        });
        if ((_a = config === null || config === void 0 ? void 0 : config.hiddenDimensions) === null || _a === void 0 ? void 0 : _a.length) {
            var showMoreGroup = svg
                .append('g')
                .on('mouseover', function () {
                d3.select(this).style('cursor', 'pointer');
                d3.select(this).select('rect').attr('fill', HighlightColor.HIGHLIGHT);
                d3.select(this).select('path').attr('fill', FunctionalColor.BLUE);
                d3.select(this).select('.show-values-label').attr('opacity', 1);
            })
                .on('mouseout', function () {
                d3.select(this).style('cursor', 'default');
                d3.select(this).select('rect').attr('fill', GreyscaleColor.ASH);
                d3.select(this).select('path').attr('fill', GreyscaleColor.AMARANTO);
                d3.select(this).select('.show-values-label').attr('opacity', 0);
            })
                .on('click', function () {
                console.log('[sankey] handling show more click');
                if (vis.trigger) {
                    var popped = config.hiddenDimensions.pop();
                    // this is not triggering a re-render
                    console.log('[sankey] triggering updateConfig', { hiddenDimensions: config.hiddenDimensions, popped: popped });
                    vis.trigger('updateConfig', [{ hiddenDimensions: config.hiddenDimensions }]);
                }
            });
            showMoreGroup
                .append('rect')
                .attr('x', 2)
                .attr('y', VERTICAL_MARGIN - VERTICAL_BAR_EXTENSION)
                .attr('width', NODE_WIDTH)
                .attr('height', height - 2 * VERTICAL_MARGIN - VERTICAL_BAR_EXTENSION / 2)
                .attr('rx', 2)
                .attr('fill', GreyscaleColor.ASH);
            // this is the bottom eye icon
            showMoreGroup
                .append('path')
                .attr('d', SHOW_MORE_ICON_PATH)
                .attr('transform', "translate(0, ".concat(height - 10, ")"))
                .attr('fill', GreyscaleColor.AMARANTO);
            var showMoreLabelHeight = 26;
            var showMoreLabelWidth = 104;
            var showMoreLabelGroup = showMoreGroup
                .append('g')
                .attr('class', 'show-values-label')
                .attr('transform', "translate(".concat(NODE_WIDTH / 2, ", ").concat(height / 2 - showMoreLabelHeight / 2, ")"))
                .attr('opacity', 0);
            showMoreLabelGroup
                .append('rect')
                .attr('height', showMoreLabelHeight)
                .attr('width', showMoreLabelWidth)
                .attr('rx', 5)
                .attr('fill', GreyscaleColor.EBONY);
            // this is the floating eye icon
            showMoreLabelGroup
                .append('path')
                .attr('d', SHOW_MORE_ICON_PATH)
                .attr('transform', 'translate(8, 8)')
                .attr('fill', GreyscaleColor.MAPLE);
            showMoreLabelGroup
                .append('text')
                .attr('x', 32)
                .attr('y', 17)
                .attr('font-weight', '400')
                .attr('font-size', 12)
                .attr('font-family', 'Open Sans, sans-serif')
                .attr('fill', GreyscaleColor.MAPLE)
                .attr('user-select', 'none')
                .text('Show More');
        }
        var getOffset = function (name) { return (shouldRenderShowDetails(name) ? 32 : 0); };
        // render text boxes
        var textRectGroup = textBox
            .append('g')
            .style('opacity', function (d) { return (d.value === 0 ? 0 : 1); });
        var rects = textRectGroup.append('rect');
        var padding = 8;
        var marginLeft = function (d) { return (FINAL_OUTCOMES.includes(d.name) ? 5 : -5); };
        var vCenter = function (d) { return (d.y1 + d.y0) / 2; };
        var labelFontSize = function (d) { return (FINAL_OUTCOMES.includes(d.name) ? 20 : 12); };
        var labelLineHeight = 8 / 6;
        // name labels
        textRectGroup
            .append('text')
            .attr('x', function (d) { return d.x1 + marginLeft(d) + padding; })
            .attr('y', function (d) {
            var offset = getOffset(d.name);
            var y = vCenter(d) - offset;
            return Math.max(y, 30);
        })
            .attr('text-anchor', 'start')
            .attr('font-weight', '400')
            .attr('font-size', labelFontSize)
            .attr('font-family', 'Open Sans, sans-serif')
            .attr('fill', function (d) {
            var isSelectedDropStage = showDetailColumnMapping[d.name] === (config === null || config === void 0 ? void 0 : config.selectedDropStage);
            return isSelectedDropStage ? GreyscaleColor.WHITE : GreyscaleColor.EBONY;
        })
            .style('user-select', 'none')
            .text(function (d) { return d.name; });
        // value labels
        textRectGroup
            .append('text')
            .attr('x', function (d) { return d.x1 + marginLeft(d) + padding; })
            .attr('y', function (d) {
            var offset = getOffset(d.name);
            var y = vCenter(d) + labelFontSize(d) * labelLineHeight - offset;
            return Math.max(y, 46);
        })
            .attr('text-anchor', 'start')
            .attr('font-weight', '600')
            .attr('font-size', labelFontSize)
            .attr('font-family', 'Open Sans, sans-serif')
            .attr('fill', function (d) {
            var isSelectedDropStage = showDetailColumnMapping[d.name] === (config === null || config === void 0 ? void 0 : config.selectedDropStage);
            return isSelectedDropStage ? GreyscaleColor.WHITE : GreyscaleColor.EBONY;
        })
            .style('user-select', 'none')
            .text(function (d) { return getAbbreviatedNumber(d.value); });
        var showDetailsGroups = textRectGroup.filter(function (d) { return shouldRenderShowDetails(d.name); });
        var handleShowDetailClick = function (d) {
            console.log('[sankey] handleShowDetailClick()');
            d3.event.stopPropagation();
            var dropStage = showDetailColumnMapping[d.name];
            if (dropStage === (config === null || config === void 0 ? void 0 : config.selectedDropStage)) {
                console.log('[sankey] postMessageToGrandparent(HIDE_DONUT_CHART_MSG)', HIDE_DONUT_CHART_MSG);
                postMessageToGrandparent(HIDE_DONUT_CHART_MSG);
                if (vis.trigger) {
                    console.log('[sankey] vis.trigger("updateConfig",', { selectedDropState: '' }, ");");
                    vis.trigger('updateConfig', [{ selectedDropStage: '' }]);
                }
                return;
            }
            console.log('[sankey] postMessageToGrandparent({ type, payload })', { type: CustomVisMessageType.SET_DROP_STAGE, payload: dropStage });
            postMessageToGrandparent({
                type: CustomVisMessageType.SET_DROP_STAGE,
                payload: dropStage,
            });
            if (vis.trigger) {
                console.log('[sankey] vis.trigger("updateConfig",', { selectedDropState: dropStage }, ");");
                vis.trigger('updateConfig', [{ selectedDropStage: dropStage }]);
            }
            else {
                console.log('[sankey] vis.trigger not defined');
            }
        };
        // "Show Details" button rect
        showDetailsGroups
            .append('rect')
            .attr('rx', 3)
            .attr('height', 20)
            .attr('fill', FunctionalColor.BLUE)
            .attr('x', function (d) { return d.x1 + marginLeft(d) + 5; })
            .attr('y', function (d) {
            var buttonMargin = 13;
            var y = vCenter(d) - padding * 2 + buttonMargin;
            return Math.max(y, buttonMargin + 46);
        })
            .attr('width', function () {
            var _a, _b;
            var textElement = (_b = (_a = this === null || this === void 0 ? void 0 : this.parentNode) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b[1];
            var width = textElement ? textElement.getComputedTextLength() + padding * 2 : 100;
            return width - padding;
        })
            .attr('data-vis', 'sankey-show-details-group')
            .style('cursor', 'pointer')
            .on('mouseover', function () {
            d3.select(this).attr('opacity', 0.9);
        })
            .on('mouseout', function () {
            d3.select(this).attr('opacity', 1);
        })
            .on('click', handleShowDetailClick);
        // "Show Details" button text
        showDetailsGroups
            .append('text')
            .attr('x', function (d) {
            var _a, _b;
            var textElement = (_b = (_a = this === null || this === void 0 ? void 0 : this.parentNode) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b[1];
            var width = textElement ? textElement.getComputedTextLength() + padding * 2 : 100;
            return d.x1 + width / 2 - padding / 2;
        })
            .attr('y', function (d) {
            var textMargin = 26.5;
            var y = vCenter(d) - padding * 2 + textMargin;
            return Math.max(y, textMargin + 45);
        })
            .attr('font-size', '10px')
            .attr('text-anchor', 'middle')
            .attr('data-vis', 'sankey-show-details-group-text')
            .attr('fill', GreyscaleColor.WHITE)
            .attr('font-family', 'Open Sans, sans-serif')
            .style('cursor', 'pointer')
            .style('user-select', 'none')
            .on('mouseover', function () {
            var _a;
            var buttonElement = (_a = this === null || this === void 0 ? void 0 : this.parentNode) === null || _a === void 0 ? void 0 : _a.children[3];
            d3.select(buttonElement).attr('opacity', 0.9);
        })
            .on('mouseout', function () {
            var _a;
            var buttonElement = (_a = this === null || this === void 0 ? void 0 : this.parentNode) === null || _a === void 0 ? void 0 : _a.children[3];
            d3.select(buttonElement).attr('opacity', 1);
        })
            .on('click', handleShowDetailClick)
            .text(function (d) {
            var dropStage = showDetailColumnMapping[d.name];
            var action = dropStage === (config === null || config === void 0 ? void 0 : config.selectedDropStage) ? 'Hide' : 'Show';
            return "".concat(action, " Details");
        });
        var nodePercentage = function (d) {
            var _a;
            var depth = d.depth;
            var opposingNode = graph.nodes.find(function (_d) { return _d.depth === depth && _d.name !== d.name; });
            var opposingValue = (_a = opposingNode === null || opposingNode === void 0 ? void 0 : opposingNode.value) !== null && _a !== void 0 ? _a : 0;
            var percentage = (100 * d.value) / (d.value + opposingValue);
            var roundedPercentage = Math.round(percentage);
            var prefix = percentage !== roundedPercentage ? '~' : '';
            if (roundedPercentage === 0) {
                prefix = '<';
                roundedPercentage = 1;
            }
            return "".concat(prefix).concat(roundedPercentage, "%");
        };
        textRectGroup
            .append('text')
            .attr('x', function (d) {
            var _a, _b;
            if (FINAL_OUTCOMES.includes(d.name)) {
                return width;
            }
            var textElement = (_b = (_a = this === null || this === void 0 ? void 0 : this.parentNode) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b[1];
            var textWidth = textElement ? textElement.getComputedTextLength() + padding : 100;
            return textWidth + d.x1 + marginLeft(d);
        })
            .attr('y', function (d) {
            var offset = getOffset(d.name);
            var y = vCenter(d) + labelFontSize(d) * labelLineHeight - offset;
            return Math.max(y, 46);
        })
            .attr('text-anchor', 'end')
            .attr('font-weight', '600')
            .attr('font-size', 12)
            .attr('font-family', 'Open Sans, sans-serif')
            .attr('fill', function (d) {
            if (FINAL_OUTCOMES.includes(d.name)) {
                return d.name === DROP_STAGE_DESCRIPTIONS.BID_OK.success
                    ? FunctionalColor.GREEN
                    : FunctionalColor.RED;
            }
            var isSelectedDropStage = showDetailColumnMapping[d.name] === (config === null || config === void 0 ? void 0 : config.selectedDropStage);
            return isSelectedDropStage ? GreyscaleColor.WHITE : GreyscaleColor.AMARANTO;
        })
            .style('user-select', 'none')
            .text(nodePercentage);
        rects
            .attr('x', function (d) { return d.x1 + marginLeft(d); })
            .attr('y', function (d) {
            var offset = getOffset(d.name);
            var y = vCenter(d) - padding * 2 - offset;
            return Math.max(y, 14);
        })
            .attr('width', function () {
            var _a, _b;
            var textElement = (_b = (_a = this === null || this === void 0 ? void 0 : this.parentNode) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b[1];
            var width = textElement ? textElement.getComputedTextLength() + padding * 2 : 100;
            return width + 3;
        })
            .attr('height', function (d) { return (shouldRenderShowDetails(d.name) ? '72px' : '40px'); })
            .attr('rx', 3)
            .attr('fill', function (d) {
            if (FINAL_OUTCOMES.includes(d.name))
                return 'transparent';
            var isSelectedDropStage = showDetailColumnMapping[d.name] === (config === null || config === void 0 ? void 0 : config.selectedDropStage);
            return isSelectedDropStage ? GreyscaleColor.AMARANTO : GreyscaleColor.MAPLE;
        })
            .attr('opacity', function (d) {
            var isSelectedDropStage = showDetailColumnMapping[d.name] === (config === null || config === void 0 ? void 0 : config.selectedDropStage);
            return isSelectedDropStage ? 1 : 0.8;
        })
            .attr('filter', function (d) { return (FINAL_OUTCOMES.includes(d.name) ? null : "url(#".concat(BOX_SHADOW, ")")); });
        /**
         * https://jira.freewheel.tv/browse/FW-114535
         *
         * Depending on the shape of the data and the size of the viewport, sometimes, link paths can spill
         * outside of the sankey chart's extent.
         *
         * Here's a blog post that describes this problem (his solution didn't end up working for us, so we're
         * covering up the chart's sides with rects instead): https://observablehq.com/@enjalot/weird-sankey-links
         */
        var linkSourceX0s = graph.links.map(function (l) { return l.source.x0; }).sort(function (a, b) { return a > b; });
        var linkTargetX1s = graph.links.map(function (l) { return l.target.x1; }).sort(function (a, b) { return a > b; });
        var spillCoverRightX0 = linkTargetX1s[linkTargetX1s.length - 1];
        var spillCoverRightX1 = svg.node().getBBox().width;
        var spillCoverLeftWidth = linkSourceX0s[0];
        var spillCoverRightWidth = spillCoverRightX1 - spillCoverRightX0;
        spillCovers
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', spillCoverLeftWidth)
            .attr('height', height)
            .attr('fill', GreyscaleColor.PINE);
        spillCovers
            .append('rect')
            .attr('x', spillCoverRightX0)
            .attr('y', 0)
            .attr('width', spillCoverRightWidth)
            .attr('height', height)
            .attr('fill', GreyscaleColor.PINE);
        doneRendering();
    },
};
looker.plugins.visualizations.add(vis);

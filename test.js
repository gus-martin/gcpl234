let iterator = 1;

const vis = {
    id: 'bugDemo',
    label: 'BugDemo',
    options: {
        hiddenDimensions: {
            type: 'array',
            label: 'Hidden Dimensions',
            default: [],
        },
        foo: {
          type: 'string',
          label: 'Foo label',
          default: '',
        },
    },
    create(element, config) {
        console.log('create()', { config });
        element.innerHTML = '<div>Bug Demo (JS)</div>';
    },
    updateAsync(data, element, config, queryResponse, details, doneRendering) {
        console.log('updateAsync()', { data, element, config, queryResponse, details });

        console.log('vis.trigger defined:', !!vis.trigger);
        if (vis.trigger) {
            const updateConfigArguments = [{
                hiddenDimensions: [iterator++],
                foo: 'bar',
            }];
            console.log('calling vis.trigger("updateConfig")', updateConfigArguments);
            vis.trigger('updateConfig', updateConfigArguments);

        }
    },
};

looker.plugins.visualizations.add(vis);

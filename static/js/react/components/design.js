MakeThis.react.components = MakeThis.react.components || {};

MakeThis.react.components.DesignList = React.createClass({
    displayName: 'DesignList',

    render: function() {
      return (
        React.createElement('div', {})
      );
    }
});

MakeThis.react.components.Design = React.createClass({
    displayName: 'Design',

    getDetailUrl: function(id) {
        return ['/design/', id].join('');
    },

    renderBubble: function() {
        return (
            React.createElement('div', {className: 'grid-item small-4 medium-3 large-2'},
                React.createElement('a', {
                    className: 'project-image image-height-ratio-3-4',
                    style: { backgroundImage: ["url('", this.props.image, "')"].join('') },
                    href: this.getDetailUrl(this.props.id)
                })
            )
        );
    },

    renderCard: function() {
        var projectClasses = ['project'];

        if(this.state.liked) {
            projectClasses.push('project-liked');
        }

        if(this.state.starred) {
            projectClasses.push('project-starred');
        }

        return (
            React.createElement('div', {className: 'grid-item small-12 medium-4 large-4 gutter-bottom'},
                React.createElement('a', {className: projectClasses.join(' '), href: this.detailUrl(this.props.id)},
                    React.createElement('div', { className: 'project-image image-height-ratio-3-4', style: { backgroundImage: ["url('", this.props.image, "')"].join('') } }),
                    React.createElement('div', { className: 'project-info'},
                        React.createElement('h2', null, this.props.title),
                        React.createElement('p', null, this.props.description),
                        React.createElement(MakeThis.react.components.ProjectStats, {views: this.props.views, design_count: this.props.design_count, code_count: this.props.code_count})
                    )
                )
            )
        );
    },

    renderDetail: function() {
        var projectClasses = ['project'];

        if(this.state.liked) {
            projectClasses.push('project-liked');
        }

        if(this.state.starred) {
            projectClasses.push('project-starred');
        }

        return (
            React.createElement('div', {className: projectClasses.join(' ')},
                React.createElement('h1', null, this.props.title),
                React.createElement('h5', {className: 'created-at'}, MakeThis.utils.pretty_date(this.props.created_at)),
                React.createElement('div', { className: 'project-image image-height-ratio-3-4', style: { backgroundImage: ["url('", this.props.image, "')"].join('') } }),
                React.createElement('div', { className: 'project-info'},
                    React.createElement('h2', null, this.props.title),
                    React.createElement('p', null, this.props.description),
                    React.createElement(MakeThis.react.components.ProjectStats, {views: this.props.views, design_count: this.props.design_count, code_count: this.props.code_count}),
                    React.createElement(MakeThis.react.components.ProjectTags, {tags: this.props.tags})
                ),
                React.createElement('p', null, this.props.description),
                React.createElement(MakeThis.react.components.DesignList, {designs: this.props.designs, display_format: "bubble"}),
                React.createElement(MakeThis.react.components.DesignList, {designs: this.props.designs, display_format: "bubble"})
            )
        );
    },

    render: function() {

        switch (this.props.display_format) {
            case "bubble":
                return this.renderBubble.call(this);
            case "card":
                return this.renderCard.call(this);
            case "detail":
                return this.renderDetail.call(this);
        }
    }
});

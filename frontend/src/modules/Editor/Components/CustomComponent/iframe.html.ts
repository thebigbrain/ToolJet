export default `<html>
    <head>
        <script src="https://unpkg.com/@babel/standalone@7.17.9/babel.min.js" integrity="sha384-q/mWU54AdnQn35rIhX7g2MtszBgXHwH9exPcvCVnncKy5WoKc457RNDNmm23Fag7" crossorigin="anonymous" referrerpolicy="no-referrer" data-required="true"></script>
        <script src="https://unpkg.com/react@16.7.0/umd/react.production.min.js" integrity="sha384-bDWFfmoLfqL0ZuPgUiUz3ekiv8NyiuJrrk1wGblri8Nut8UVD6mj7vXhjnenE9vy" crossorigin="anonymous" referrerpolicy="no-referrer" data-required="true"></script>
        <script src="https://unpkg.com/react-dom@16.7.0/umd/react-dom.production.min.js" integrity="sha384-mcyjbblFFAXUUcVbGLbJZR86Xd7La0uD1S7/Snd1tW0N+zhy97geTqVYDQ92c8tI" crossorigin="anonymous" referrerpolicy="no-referrer" data-required="true"></script>
    </head>
    <body style='margin: 0'>
        <script data-required="true">
            let callbackFn = () => {};
            let props = {};
            window.Tooljet = {
                componentId: window.frameElement.getAttribute('data-id'),
                subscribe: fn => {
                    fn(props);
                    callbackFn = fn;
                },
                runQuery: (name, params) => {
                    window.parent.postMessage({
                    from: 'customComponent',
                    message: "RUN_QUERY",
                    queryName: name,
                    parameters: JSON.stringify(params || {}),
                    componentId: window.Tooljet.componentId
                }, "*")},
                updateProps: obj => window.parent.postMessage({
                    from: 'customComponent',
                    message: "UPDATE_DATA",
                    updatedObj: obj,
                    componentId: window.Tooljet.componentId
                }, "*"),
                init: () => {
                    window.parent.postMessage({
                        from: 'customComponent',
                        message: "INIT",
                        componentId: window.Tooljet.componentId,
                    }, "*");
            
                    window.addEventListener('message', (e) => {
                        if(e.data.message === 'CODE_UPDATED' || e.data.message === 'INIT_RESPONSE'){
                            const tags = document.getElementsByTagName("script");
                            for(let i = 0; i < tags.length; i++){
                                if(tags[i].getAttribute("data-required") !== 'true'){
                                    tags[i].parentNode.removeChild(tags[i]);
                                    i = i - 1;
                                }
                            }
                            var head = document.getElementsByTagName('head')[0];
                            script = document.createElement('script');
                            script.text = e.data.code
                            script.type = "text/babel";
                            script.setAttribute("data-type", "module");
                            head.appendChild(script)
                            window.dispatchEvent(new Event('DOMContentLoaded'));
                            props = e.data.data;
                            callbackFn(e.data.data)
                        } else if(e.data.message === 'DATA_UPDATED'){
                            props = e.data.data;
                            callbackFn(e.data.data)
                        }
                    });
                }
            }
            window.addEventListener('load', function() {
                window.Tooljet.init();
            })
        </script>
        <script type="text/babel" data-required="true"> window.Tooljet.connectComponent = WrappedComponent => {
            class ConnectedComponent extends React.Component {
                constructor() {
                    super(), this.state = {}
                }
                componentDidMount() {
                    window.Tooljet.subscribe((e => this.setState({
                        data: e
                    })))
                }
                render() {
                return <WrappedComponent data={this.state?.data ?? {}} 
                    updateData={(e) => Tooljet.updateProps(e)} 
                    runQuery={(e, params) => Tooljet.runQuery(e, params)}/>
                }
            }
            return ConnectedComponent;
            }
        </script>
    </body>
</html>`;

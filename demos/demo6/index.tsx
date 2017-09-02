import {
  DiagramEngine,
  DefaultNodeFactory,
  DefaultLinkFactory,
  DiagramModel,
  DefaultNodeModel,
  LinkModel,
  DefaultPortModel,
  DiagramWidget,
  DefaultNodeInstanceFactory,
  DefaultPortInstanceFactory,
  LinkInstanceFactory
} from "../../src/main";
import * as React from "react";

class WorkingSerialization extends React.Component {
  public engine;
  constructor(props) {
    super(props);
    //1) setup the diagram engine
    const engine = new DiagramEngine();
    this.engine = engine;
  }

  componentDidMount() {
    const { engine } = this;
    engine.registerNodeFactory(new DefaultNodeFactory());
    engine.registerLinkFactory(new DefaultLinkFactory());

    //2) setup the diagram model
    var model = new DiagramModel();

    //3-A) create a default node
    var node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)");
    var port1 = node1.addPort(new DefaultPortModel(false, "out-1", "Out"));
    node1.x = 100;
    node1.y = 100;

    //3-B) create another default node
    var node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
    var port2 = node2.addPort(new DefaultPortModel(true, "in-1", "IN"));
    node2.x = 400;
    node2.y = 100;

    //3-C) link the 2 nodes together
    var link1 = new LinkModel();
    link1.setSourcePort(port1);
    link1.setTargetPort(port2);

    //4) add the models to the root graph
    model.addNode(node1);
    model.addNode(node2);
    model.addLink(link1);

    //5) load model into engine
    engine.setDiagramModel(model);

    //!------------- SERIALIZING ------------------

    var str = JSON.stringify(model.serializeDiagram());

    //!------------- DESERIALIZING ----------------

    //we need this to help the system know what models to create form the JSON
    engine.registerInstanceFactory(new DefaultNodeInstanceFactory());
    engine.registerInstanceFactory(new DefaultPortInstanceFactory());
    engine.registerInstanceFactory(new LinkInstanceFactory());

    //deserialize the model
    var model2 = new DiagramModel();
    model2.deSerializeDiagram(JSON.parse(str), engine);
    engine.setDiagramModel(model2);

    setTimeout(() => this.forceUpdate(), 0);
  }

  render() {
    return <DiagramWidget diagramEngine={this.engine} />;
  }
}

export default () => <WorkingSerialization />;

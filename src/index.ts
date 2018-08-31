import * as React from 'react'

let renderer = (propNames, controllers, children, parentOutputs, output) => {
  let outputs = {
    ...parentOutputs,
    [propNames[0]]: output,
  }
  let remainingPropNames = propNames.slice(1)
  if (remainingPropNames.length === 0) {
    return children(outputs)
  }
  else {
    let controller = controllers[propNames[1]]
    let innerRenderer = output => renderer(remainingPropNames, controllers, children, outputs, output)
    return controller(innerRenderer)
  }
}

interface CombineProps {
  [name: string]: (children) => React.ReactElement<{ children: (output) => React.ReactElement<any> }>,
}

type CombineOutput<Props extends CombineProps> = {
  [K in keyof Props]: FirstArgumentType<ReturnType<Props[K]>["props"]["children"]>
}

type FirstArgumentType<T extends (output: any) => React.ReactElement<any>> = T extends (output: infer O) => React.ReactElement<any> ? O : never

export class Combine<Props extends CombineProps> extends React.Component<Props & { children: (props: CombineOutput<Props>) => React.ReactElement<any> }> {
  render() {
    let children = this.props.children
    let controllerRenderers = {}

    let propNames = Object.keys(controllerRenderers)

    for (let i = 0; i < propNames.length; i++) {
      let propName = propNames[i]
      let controller = controllerRenderers[propName]
      if (typeof controller !== 'function') {
        controllerRenderers[propName] = (children) => React.cloneElement(controller, { children })
      }
    }

    let controller = controllerRenderers[propNames[0]]
    let finalRenderer = output => renderer(propNames, controllerRenderers, children, undefined, output)
    return controller(finalRenderer)
  }
}
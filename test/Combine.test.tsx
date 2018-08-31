import * as React from 'react'
import { create } from 'react-test-renderer'
import { Combine } from '../src'

describe('Combine', () => {
  it("combines multpile controller outputs", () => {
    let ConstantController = ({ children, ...other }) => {
      return children(other)
    }

    const renderer = create(
      <Combine
        x={children => <ConstantController a={1} children={children} />}
        y={children => <ConstantController b={2} children={children} />}
      >
        {({x, y}) => 
          <div>{JSON.stringify([x, y])}</div>
        }
      </Combine>
    );    

    expect(renderer.toJSON().children[0]).toEqual(JSON.stringify([{a: 1}, { b: 2}]))
  })
})
import { render } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('ActiveLink component', () => {
  it('renders correctly', () => {
    const { debug, getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )

    expect(getByText('Home')).toBeInTheDocument()
  })

  it('adds active class if the link as currently active', () => {
    const { debug, getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    )

    expect(getByText('Home')).toHaveClass('active')
  })
})

// jest.mock -> é como se fosse uma imitação. Então ele está substituindo a funcionalidade useRouter do next
// debug() -> é como um console.log ele mostra o código HTML virtual que esse trecho de código gerou, isso no nosso terminal
//expect() -> é uma função que espera por algo
// getByText() -> é uma função que vem de dentro de render e ele busca algo pelo texto.
// toBeInTheDocument() -> ele verifica se está no documento, que no caso é getByText('Home')
// toHaveClass() -> faz uma verificação na classe.
// describe() -> quando temos muitos testes nos colocamos dentro de describe ele basicamente vai criar uma categorização

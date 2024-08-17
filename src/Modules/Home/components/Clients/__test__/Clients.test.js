import { render, screen } from "@testing-library/react";
import { MockedProvider } from '@apollo/client/testing';
import Clients from "../Clients";
import { GET_ALL_CLIENTS } from '../../../../../Graphql/Query/Querys';
const mocks = [
    {
        request: {
            query: GET_ALL_CLIENTS,
        },
        result: {
            data: {
                getAllClients: {
                    id:'96c57572-6648-40a2-a08b-15e84e6d6ac8',
                    clientname:'Techmahindra',
                    clientlogo:'https://superplayerauction.com/img/clients/tech-mahindra-logo.webp',
                },
            },
        },
    },
]
describe('<Clients>',()=>{
    test('renders or not', () => {
        render(
            <MockedProvider mocks={mocks}>
                <Clients />
            </MockedProvider>
        );
        screen.debug(undefined, Infinity);
        expect(screen.getByText('CLIENTS')).toBeInTheDocument();
    });
});
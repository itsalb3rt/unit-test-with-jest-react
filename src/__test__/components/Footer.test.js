import React from 'react';
import { mount } from 'enzyme';
import {create} from 'react-test-renderer';
import Footer from '../../components/Footer';

describe('<Footer />', ()=>{
    const footer = mount(<Footer />);    

    test('Render del component Footer', () => {
        expect(footer.length).toEqual(1); // check is component render
    });

    test('Render del titulo', () => {
        // Find a element by class name and check is text contain equeal to `any`
        expect(footer.find('.Footer-title').text()).toEqual("Platzi Store");
    });

});

describe('Footer Snapshot', () => {
    test('Comprobar la UI del component Footer', () => {
        const footer = create(<Footer />);
        /**
         * The first time you run the test the snapshot is created 
         * and when you run the test again just compare the snapshot with the 
         * component in these next tests
         */
        expect(footer.toJSON()).toMatchSnapshot();
    })
})
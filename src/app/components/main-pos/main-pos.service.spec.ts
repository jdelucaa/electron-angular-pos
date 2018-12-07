import {TestBed} from '@angular/core/testing';

import {MainPosService} from './main-pos.service';

describe('MainPosService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: MainPosService = TestBed.get(MainPosService);
        expect(service).toBeTruthy();
    });
});

/**
 * pr-stats
 * Copyright (c) 2023-present NAVER Corp.
 * Apache-2.0
 */

import {expect} from "chai";
import {addMinutes, dummyCreator as dc} from "@/test-helper";
import {createPRStats} from "@/output";
import {averageFileCount} from "../";

const MOCK_CREATED_DATE = new Date("2023-09-15T14:00:00Z");
const MOCK_MERGED_DATE = new Date("2023-09-20T19:00:00Z");

describe("PRList > averageFileCount", () => {
    it("특정 PR 목록에서 PR당 변경된 파일 수의 평균을 구할 수 있어야 한다.", () => {
        // given
        const author = "author1";
        const [reviewer1, reviewer2, reviewer3] = ["reviewer1", "reviewer2", "reviewer3"];

        const activities1 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -20)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -10)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer3, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 80)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 90)),
            dc.createApproval(reviewer3, addMinutes(MOCK_CREATED_DATE, 120)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities2 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -20), {parents: [{}, {}]}),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 15)),
            dc.createReviewRequest(reviewer2, addMinutes(MOCK_CREATED_DATE, 15)),
            dc.createComment(author, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 230)),
            dc.createApproval(reviewer2, addMinutes(MOCK_CREATED_DATE, 350)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const activities3 = [
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, -30)),
            dc.createOpen(author, MOCK_CREATED_DATE),
            dc.createCommit(author, addMinutes(MOCK_CREATED_DATE, 5)),
            dc.createReviewRequest(reviewer1, addMinutes(MOCK_CREATED_DATE, 10)),
            dc.createApproval(reviewer1, addMinutes(MOCK_CREATED_DATE, 40)),
            dc.createMerge(author, MOCK_MERGED_DATE),
        ];
        const mockChangedFiles1 = 11;
        const mockChangedFiles2 = 5;
        const mockChangedFiles3 = 3;
        const prStats1 = createPRStats(dc.createPR({userId: author, changedFiles: mockChangedFiles1}, activities1));
        const prStats2 = createPRStats(dc.createPR({userId: author, changedFiles: mockChangedFiles2}, activities2));
        const prStats3 = createPRStats(dc.createPR({userId: author, changedFiles: mockChangedFiles3}, activities3));

        // when
        const result = averageFileCount([prStats1, prStats2, prStats3]);

        // then
        expect(result.value).to.be.equal((mockChangedFiles1 + mockChangedFiles2 + mockChangedFiles3) / 3);
    });
});

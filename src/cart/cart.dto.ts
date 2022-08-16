import { ArrayMinSize, IsNumber } from "class-validator";

export class Add2CartDTO {
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  tracks: number[];
}
